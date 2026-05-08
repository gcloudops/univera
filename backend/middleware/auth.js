const jwt = require('jsonwebtoken');

// हा middleware प्रत्येक protected route वर लागतो
const auth = (req, res, next) => {
  // Header मधून token घे
  const token = req.headers.authorization?.split(' ')[1];

  if (!token)
    return res.status(401).json({ success: false, message: 'No token provided' });

  try {
    // Token verify कर
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // user info request मध्ये attach
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Role check — admin, hr, student
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ success: false, message: 'Access denied' });
  next();
};

module.exports = auth;
module.exports.authorize = authorize;