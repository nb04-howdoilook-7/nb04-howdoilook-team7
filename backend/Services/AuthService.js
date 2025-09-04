import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { redisClient } from '../Libs/redisClient.js';
import sendEmail from '../Libs/SendEmail.js';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

async function requestVerificationService({ email, password, nickname }) {
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { nickname }] },
  });
  if (existingUser) {
    throw new Error('이미 가입된 이메일 또는 닉네임입니다.');
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
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

async function loginUserService({ email, password }) {
  // console.log('로그인 로직');
  // console.log('email: ', email, 'password : ', password);
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    const error = new Error('가입되지 않은 사용자입니다. (이메일 오류)');
    error.statusCode = 401;
    throw error;
  }
  // console.log('db에서 가져온 유저 패스워드: ', user.password);
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error('비밀번호가 일치하지 않습니다.');
    error.statusCode = 401;
    throw error;
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: '1h',
  });
  return { user, token };
}

export { requestVerificationService, confirmSignupService, loginUserService };
