import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
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

async function postUserService({ email, password, nickname }) {
  const newUser = await prisma.user.create({
    data: { email, password, nickname },
  });
  return newUser;
}

async function loginUserService({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const error = new Error('가입되지 않은 사용자입니다. (이메일 오류)');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    const error = new Error('비밀번호가 일치하지 않습니다.');
    error.statusCode(401);
    throw error;
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return { user, token };
}

async function getUserByIdService(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nickname: true,
    },
  });
  return user;
}
export { postUserService, loginUserService, getUserByIdService };
