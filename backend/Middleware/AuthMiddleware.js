const jwt = require('jsonwebtoken');
const secret = "mysecretkey";

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('Authorization');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
