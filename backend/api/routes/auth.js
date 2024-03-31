const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db");
const { generateUserJwtToken } = require("./../middlewares/authMiddleware");
const { authenticateToken } = require("./../middlewares/authMiddleware");
const speakeasy = require("speakeasy");
var QRCode = require("qrcode");

let refreshTokens = [];

router.post("/token", (req, res) => {
  let { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "You are not authenticated!" });
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: "Token is not valid!" });
  }
  /*for rotation we need relation between user and refreshToken in db*/
  /*
  //rotating refreshToken
  //destroying old refreshToken
  const withoutChosen = refreshTokens.filter(function (chosen) {
    return chosen !== refreshToken;
  });

  //generating new refreshToken
  refreshToken = generateRefreshToken(user);
  refreshTokens.push(refreshToken);
  */
  /*make a structure(cookie) where we store user and accessToken so when we call this route
   * we can check if token has expired if so we destroy refreshToken related
   * to it */
  /*
  jwt.verify(cookie.accessToken, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
    if(err){
      if(err.name === 'TokenExpiredError'){
        req.body = "";
        refreshTokens=[];
        return res.status(403).json({ message: "Access token expired" });
      }
      jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, userData) => {
        if (err) {
          return res.status(403).json({ message: "Token is not valid!" });
        }

        const user = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
        };
        const newRefreshToken = generateRefreshToken(user);
        refreshTokens.push(newRefreshToken);
        const accessToken = generateAccessToken(user);

        res.status(200).json({ accessToken });
      }
  );
    }
  });
  */

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, userData) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid!" });
      }

      const user = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role,
      };
      const token = generateUserJwtToken(user);

      res.status(200).json({ token });
    }
  );
});

router.post("/login", async (req, res) => {
  let { email, number, password } = req.body;

  if (!email && !number) {
    return res
      .status(400)
      .json({ message: "Email or mobile number is required!" });
  }

  let query;
  let queryValues;
  if (email != " ") {
    query = 'SELECT * FROM "Person" WHERE "email" = $1';
    queryValues = [email];
  } else {
    query = 'SELECT * FROM "Person" WHERE "mobileNumber" = $1';
    queryValues = [number];
  }

  //console.log(query);
  //console.log(queryValues);

  const result = await db.query(query, queryValues);

  //console.log(result);

  if (result.rowCount === 0) {
    return res
      .status(400)
      .json({ message: "Email or mobile number incorrect!" });
  }

  const isValidPassword = await bcrypt.compare(
    password,
    result.rows[0].password
  );

  if (!isValidPassword) {
    return res.status(400).json({ message: "Password incorrect!" });
  }

  const { id, username, email: userEmail, role } = result.rows[0];
  const user = { id, username, email: userEmail, role };

  const token = generateUserJwtToken(user);

  refreshTokens.push(token);

  // Generate secret for 2FA
  var secret = speakeasy.generateSecret();
  console.log("citav secret je objekat koji izgleda ovako: " + secret);
  console.log("secret generirani: " + secret.otpauth_url);

  res.status(200).json({
    ...user,
    token,
    secret,
  });
});

router.post("/logout", (req, res) => {
  const { token } = req.body;
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: "You are not authenticated!" });
  }

  if (!refreshTokens.includes(token)) {
    return res.status(403).json({ message: "Token is not valid!" });
  }

  refreshTokens = refreshTokens.filter((checkToken) => checkToken !== token);

  res.status(200).json({ message: "Logged out successfully." });
});

router.post("/twofactorsetup", (req, res) => {
  const { secret } = req.body;

  QRCode.toDataURL(secret, (err, dataUrl) => {
    if (err) {
      return res.status(500).json({ error: "Error generating QR code" });
    }

    res.json({ dataUrl });
  });
});

// verify 2fa
router.post("/verify", (req, res) => {
  const { userToken: token, secret } = req.body;
  const baseSecret = secret.base32;

  const verified = speakeasy.totp.verify({
    secret: baseSecret,
    encoding: "base32",
    token,
  });

  res.json({ success: verified });
});

module.exports = router;
