const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    console.log('Authenticated user:', user);
    next();
  });
};


function authorizeRoles(...roles) {
  return (req, res, next) => {
    console.log('User role:', req.user.role, 'Allowed roles:', roles);  // <-- add this line
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Role mismatch' });
    }
    next();
  };
}


module.exports = { authenticateJWT, authorizeRoles };
