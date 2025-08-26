import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { redisClient } from '../Utils/redisClient.js';
import sendEmail from '../Utils/SendEmail.js';

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

async function requestVerificationService({ email, password, nickname }) {
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { nickname }] },
  });
  if (existingUser) {
    throw new Error('이미 가입된 이메일 또는 닉네임입니다.');
  }

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();
  const userData = JSON.stringify({
    password,
    nickname,
    code: verificationCode,
  });

  // Redis에 사용자 데이터와 인증 코드 저장 (10분)
  await redisClient.set(email, userData, { EX: 600 });

  // 인증 코드 이메일로 전송
  await sendEmail(
    email,
    '[How Do I Look] 회원가입 인증 코드',
    `인증 코드는 [${verificationCode}] 입니다. 10분 안에 입력해주세요.`,
  );

  return { message: '인증 코드가 이메일로 전송되었습니다.' };
}

async function confirmSignupService({ email, code }) {
  const dataString = await redisClient.get(email);
  if (!dataString) {
    throw new Error('인증 코드가 만료되었거나 존재하지 않습니다.');
  }

  const data = JSON.parse(dataString);
  if (data.code !== code) {
    throw new Error('인증 코드가 일치하지 않습니다.');
  }

  const newUser = await prisma.user.create({
    data: { email: email, password: data.password, nickname: data.nickname },
  });

  await redisClient.del(email); // 인증 후 Redis에서 데이터 삭제

  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
    expiresIn: '1h',
  });
  return { user: newUser, token };
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
    select: {
      id: true,
      thumbnail: true,
      title: true,
      categories: true,
      content: true,
      viewCount: true,
      curationCount: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          nickname: true,
        },
      },
      tags: {
        select: {
          tagname: true,
        },
      },
    },
    skip: (page - 1) * limit,
    take: parseInt(limit), // 추후에 validation 추가
  });
  const userStyles = {
    data: userStyle.map((style) => ({
      ...style,
      tags: style.tags.map((tag) => tag.tagname),
    })),
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
  requestVerificationService,
  confirmSignupService,
  loginUserService,
  getUserStyleService,
  getUserLikeStyleService,
  getUserInfoService,
  deleteUserService,
  putUserService,
};
