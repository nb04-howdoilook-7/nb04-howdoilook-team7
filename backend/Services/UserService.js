import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function postUserService(email, password, nickname) {
  const newUser = await prisma.user.create({
    data: { email, password, nickname },
  });
  return newUser;
}

async function loginUserService(email, password) {
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

  const token = jwt.sign({ userId: user.id }, Buffer.from(process.env.JWT_SECRET), {
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
