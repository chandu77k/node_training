var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  var authHeader = req.headers['authorization'];
  var token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Error:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};
