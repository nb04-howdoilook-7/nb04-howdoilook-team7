import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

async function getUserInfo({ authorization }) {
  if (!authorization) {
    // 추후에 유효성 검증으로 처리
    console.log('   ❌ 인증 실패: 토큰이 없음');
    const err = new Error('로그인이 필요합니다.');
    err.statusCode = 401;
    throw err;
  }
  const user = authorization.replace('Bearer ', '');

  const userInfo = await prisma.user.findUnique({});
}
