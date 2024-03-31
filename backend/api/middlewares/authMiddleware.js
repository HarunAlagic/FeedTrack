const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  console.log(authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: "You are not authenticated!" });
  }

  const decodedToken = jwt.verify(
    authHeader,
    process.env.ACCESS_TOKEN_SECRET,
    (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid!" });
      }
    }
  );

  const extendedToken = jwt.sign(
    { ...decodedToken, exp: decoded.exp + 30 * 60 },
    process.env.ACCESS_TOKEN_SECRET
  );
  req.headers["authorization"] = extendedToken;

  req.token = decodedToken;
  next();
}

function authRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({ message: "Not allowed" });
    }

    next();
  };
}

function generateUserJwtToken(user) {
  const expiresIn = "30m";
  const email = user.email;
  console.log(user);
  const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn,
  });
  return token;
}

module.exports = {
  authenticateToken,
  authRole,
  generateUserJwtToken,
};
