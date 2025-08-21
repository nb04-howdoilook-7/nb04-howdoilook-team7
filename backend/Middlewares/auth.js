import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId;
      next();
    } catch (e) {
      res.status(401);
      throw new Error('인증되지 않았습니다. 토큰 만료 및 실패');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('인증되지 않았습니다. 토큰 없음');
  }
});

export default protect;
