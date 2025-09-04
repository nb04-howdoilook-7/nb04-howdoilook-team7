import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET_KEY;

function protect() {
  return (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
      } catch (e) {
        res
          .status(401)
          .json({ error: '인증되지 않았습니다. 토큰 만료 및 실패' });
      }
    } else {
      res.status(401).json({ error: '인증되지 않았습니다. 토큰 없음' });
    }
  };
}

function optionalProtect() {
  return (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
      } catch (e) {
        console.log('Optional authentication failed:', e.message);
      }
    }
    next();
  };
}

export { protect, optionalProtect };
