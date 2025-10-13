import jwt from 'jsonwebtoken';
import { redisClient } from '@/Libs/redisClient.js';
import sendEmail from '@/Libs/SendEmail.js';
import {
  GOOGLE_CLIENT_ID,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from '@/Libs/constants.js';
import type { ConfirmEmail, Login, Signup } from '@/types/auths.typs.js';
import { passwordHashing, validatePassword } from '@/Libs/bcrypt.js';
import { BadRequestError, ConflictError, UnauthorizedError } from '@/Libs/errors.js';
import prisma from '@/Libs/prisma.js';
import client from '@/Libs/google-oauth.js';
import type { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client.js';

async function requestVerificationService({ email, password, nickname }: Signup) {
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { nickname }] },
  });
  if (existingUser) {
    throw new ConflictError('이미 가입된 이메일 또는 닉네임입니다.');
  }
  const hasedPassword = await passwordHashing(password);

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  const userData = JSON.stringify({
    password: hasedPassword,
    nickname,
    code: verificationCode,
  });

  // Redis에 사용자 데이터와 인증 코드 저장 (10분)
  await redisClient.set(email, userData, { EX: 600 });

  // 인증 코드 이메일로 전송
  await sendEmail({
    to: email,
    subject: '[How Do I Look] 회원가입 인증 코드',
    text: `인증 코드는 [${verificationCode}] 입니다. 10분 안에 입력해주세요.`,
  });

  return { message: '인증 코드가 이메일로 전송되었습니다.' };
}

async function confirmSignupService({ email, code }: ConfirmEmail) {
  const dataString = await redisClient.get(email);
  if (!dataString) {
    throw new UnauthorizedError('인증 코드가 만료되었거나 존재하지 않습니다.');
  }

  const data = JSON.parse(dataString);
  if (data.code !== code) {
    throw new UnauthorizedError('인증 코드가 일치하지 않습니다.');
  }

  const newUser = await prisma.user.create({
    data: { email: email, password: data.password, nickname: data.nickname },
  });

  await redisClient.del(email); // 인증 후 Redis에서 데이터 삭제

  const token = jwt.sign({ userId: newUser.id }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
  return { user: newUser, token };
}

async function loginUserService({ email, password }: Login) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    throw new UnauthorizedError('가입되지 않은 사용자입니다. (이메일 오류)');
  }
  if (!user.password) {
    throw new BadRequestError('비밀번호가 입력되지않았습니다');
  }
  const isPasswordValid = await validatePassword(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('비밀번호가 일치하지 않습니다.');
  }
  const token = jwt.sign({ userId: user.id }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
  return { user, token };
}

async function googleLoginService(frontRedirectUrl: string) {
  const authorizeUrl = client.generateAuthUrl({
    access_type: 'offline', // refresh token을 받기 위해 필요
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    // state 파라미터에 최종 목적지를 담아 Google에 전달
    // CSRF 공격 방지를 위해 해싱등을 통해 암호화된 값을 사용하는 것이 더 안전하다고함
    state: frontRedirectUrl,
  });
  return { authorizeUrl };
}

// 콜백 처리: code와 state를 받아 토큰과 최종 목적지를 반환
async function googleLoginCallbackService(code: string, state: string) {
  console.log('다시 요청 도달');
  // 1. authorization code로 access token과 id_token을 받음 (타입 명시)
  const { tokens }: GetTokenResponse = await client.getToken(code);
  client.setCredentials(tokens);

  // id_token이 없을 경우를 대비한 방어 코드
  if (!tokens.id_token) {
    throw new BadRequestError('ID token not found');
  }

  // 2. id_token을 사용하여 사용자 정보를 가져옴
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new BadRequestError('Failed to get payload from ticket');
  }

  console.log('구글 사용자 정보:', payload);
  const sub = payload.sub;
  const email = payload.email;
  const name = payload.name;
  // const picture = payload.picture;

  // 3. 구글 로그인 정보를 통해 유저 정보 조회
  let user = await prisma.user.findUnique({
    where: {
      providerId: sub,
    },
  });
  if (!user) {
    if (!name) {
      throw new BadRequestError('사용자 이름 없음');
    }
    if (!email) {
      throw new BadRequestError('사용자 이메일 없음');
    }
    user = await prisma.user.create({
      data: {
        nickname: name,
        email,
        provider: 'google',
        providerId: sub,
      },
    });
    console.log('사용자 새로 생성 완료');
  }

  // 4. 유저 정보를 토대로 토큰 발급
  const accessToken = jwt.sign({ userId: user.id }, JWT_ACCESS_TOKEN_SECRET!, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_TOKEN_SECRET!, {
    expiresIn: '24h',
  });
  console.log('구글 로그인 완료');
  return { accessToken, refreshToken, finalRedirectUrl: state }; // 구글로부터 돌려받은 최종 목적지도 전달
}

export {
  requestVerificationService,
  confirmSignupService,
  loginUserService,
  googleLoginService,
  googleLoginCallbackService,
};
