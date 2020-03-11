import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
  // check if authorization exists

  if (!req.headers.authorization) {
    return res.status(403).json({ error: 'Token not provided' });
  }

  const [, token] = req.headers.authorization.split(' ');

  try {
    const decoded = jwt.verify(token, 'apenasUmProjeto');

    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export default authMiddleware;
