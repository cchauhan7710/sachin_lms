const jwt = require("jsonwebtoken");

module.exports = function adminAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admins allowed" });
    }

    req.admin = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
