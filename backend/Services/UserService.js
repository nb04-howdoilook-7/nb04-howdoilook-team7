import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

async function getUserInfoService(userId) {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nickname: true,
    },
  });
  return userInfo;
}

async function signupService({ email, password, nickname }) {
  const newUser = await prisma.user.create({
    data: { email, password, nickname },
  });
  return newUser;
}
async function putUserService(userId, data) {
  const putUser = await prisma.user.update({
    where: { id: userId },
    data,
  });
  return putUser;
}
async function deleteUserService(userId) {
  const deleteUser = await prisma.user.delete({
    where: { id: userId },
  });
  return deleteUser;
}
async function getUserStyleService(userId, { page, limit }) {
  const userStyle = await prisma.style.findMany({
    where: { userId },
    skip: (page - 1) * limit,
    take: parseInt(limit), // 추후에 validation 추가
  });
  const userStyles = {
    // 프론트에서 styles 라는 키로 데이터를 찾음 -> 나중에 프론트 백엔드 싱크 맞춰야 함
    styles: userStyle,
  };
  return userStyles;
}
async function getUserLikeStyleService(userId) {
  const userLikeStyle = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      // like라는 모델을 따로 생성? user가 작성한 스타일과 다르게, 좋아요를 누른 스타일은 어떻게 매핑시켜야할지 고민
      like: true,
    },
  });
  return userLikeStyle;
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
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: '1h',
  });
  return { user, token };
}

export {
  signupService,
  loginUserService,
  getUserStyleService,
  getUserLikeStyleService,
  getUserInfoService,
  deleteUserService,
  putUserService,
};
