
const jwt = require('jsonwebtoken');
function authenticateToken(req, res, next) {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - Token missing' });
    }
  
    jwt.verify(token, 'hgsj#4&*#$9ejjen', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
      }
  
      req.user = decoded;
      next();
    });
  }

module.exports = authenticateToken