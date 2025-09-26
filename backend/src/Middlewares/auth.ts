import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET } from '../Libs/constants.js';
import type { RequestHandler } from 'express';

const JWT_SECRET = JWT_ACCESS_TOKEN_SECRET;

function protect(): RequestHandler {
  // 추후 구조 수정
  return (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1];
        if (!token) {
          return res.status(401).json({ error: '인증되지 않았습니다. 토큰 없음' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
          // 이 블록 안에서 TypeScript는 decoded를 객체로 확신합니다.
          req.tokenPayload = decoded['userId'];
        } else {
          // 토큰의 payload가 예상과 다른 형식이므로 에러 처리
          res.status(401).json({ error: '유효하지 않은 토큰 형식입니다.' });
        }
        return next();
      } catch (e) {
        console.log(e);
        res.status(401).json({ error: '인증되지 않았습니다. 토큰 만료 및 실패' });
      }
    } else {
      res.status(401).json({ error: '인증되지 않았습니다. 토큰 없음' });
    }
  };
}

function optionalProtect(): RequestHandler {
  return (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1];
        if (!token) {
          return res.status(401).json({ error: '인증되지 않았습니다. 토큰 없음' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
          // 이 블록 안에서 TypeScript는 decoded를 객체로 확신합니다.
          req.tokenPayload = decoded['userId'];
        } else {
          // 토큰의 payload가 예상과 다른 형식이므로 에러 처리
          res.status(401).json({ error: '유효하지 않은 토큰 형식입니다.' });
        }
        return next();
      } catch (e) {
        console.log('Optional authentication failed:', e);
      }
    }
    return next();
  };
}

export { protect, optionalProtect };
