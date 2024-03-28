const jwt = require("jsonwebtoken");
const { roles } = require("../constants");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "You are not authenticated!" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token is not valid!" });
    }

    req.user = user;
    next();
  });
}

function authRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({ message: "Not allowed" });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  authRole,
};
