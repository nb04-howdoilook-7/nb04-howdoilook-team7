import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { redisClient } from '../Utils/redisClient.js';
import sendEmail from '../Utils/SendEmail.js';
import { deletionSingle } from '../Utils/CloudinaryUtils.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

async function getUserInfoService(userId) {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nickname: true,
      profileImage: true,
      _count: {
        select: {
          Curation: true,
          Style: true,
          likes: true,
        },
      },
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
// prettier-ignore
async function putUserService(userId, { password, currentPassword, profileImage, ...data },) {
  // 패스워드가 값이 있을때만 변경하도록 테스트
  // prettier-ignore
  if ((password && password !== '') && (currentPassword && currentPassword !== '')) { 
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        password: true,
      },
    }); 
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      const error = new Error('비밀번호가 일치하지 않습니다.');
      error.statusCode = 401;
      throw error;
    }
    // 업데이트할 내용에 password 추가
    data = {
      ...data,
      password,
    }
  }
  // 프로필 이미지 처리 
  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { imageId: true },
  });

  let newImage;
  // 새 프로필 이미지가 제공된 경우
  if (profileImage && profileImage !== '') {
    // 1. 기존 이미지가 있다면 삭제
    if (currentUser.imageId) {
      const oldImage = await prisma.image.findUnique({
        where: { id: currentUser.imageId },
        select: { url: true },
      });

      if (oldImage) {
        // cloudinary에서 프로필 이미지 삭제
        await deletionSingle(cloudinary, oldImage)
        // DB에서 기존 Image 레코드 삭제
        await prisma.image.delete({ where: { id: currentUser.imageId } });
      }
    }

    // 2. 새 Image 레코드 생성
    newImage = await prisma.image.create({
      data: {
        url: profileImage,
      },
    });
    // 업데이트할 내용에 프로필 이미지, 이미지 모델 연결 추가
    data = {
      ...data,
      profileImage,
      imageId: newImage.id,
    }
  }

  // 최종 put 요청 <- 여기만 추가해보고 테스트
  const putUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...data,
    },
    include: {
      _count: {
        select: {
          Curation: true,
          Style: true,
        },
      },
    }
  });
  return putUser;
}
async function deleteUserService(userId) {
  // 유저를 삭제할 때 관계된 이미지부터 먼저 삭제
  // 1. 유저랑 연결된 이미지 조회
  // 2. 클라우디너리에서 해당 이미지 삭제
  // 3. db Image 테이블에서 해당 이미지 삭제
  // 4. 유저 삭제
  // prettier-ignore
  const result = await prisma.$transaction(async (tx) => { 
    const deleteUser = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      select: { imageId: true },
    }); // 삭제할 유저 조회
    if (deleteUser && deleteUser.imageId) { // 삭제할 유저의 프로필 사진 조회
      const img = await tx.image.findUniqueOrThrow({
        where: { id: deleteUser.imageId },
      });
      // cloudinary에서 프로필 이미지 삭제
      await deletionSingle(cloudinary, img);
      // DB에서 기존 Image 레코드 삭제
      await tx.image.delete({ where: { id: deleteUser.imageId } });
    }
    const user = await tx.user.delete({ // 유저 삭제
      where: { id: userId },
    });
    return user;
  });
  return result;
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
async function getUserLikeStyleService(userId, { page = 1, limit = 9 }) {
  const userLikedStyles = await prisma.styleLike.findMany({
    where: { userId: userId },
    select: {
      style: {
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
      },
    },
    skip: (page - 1) * limit,
    take: parseInt(limit),
  });

  const totalItemCount = await prisma.styleLike.count({
    where: { userId: userId },
  });

  const transformedStyles = userLikedStyles.map((like) => ({
    ...like.style,
    tags: like.style.tags ? like.style.tags.map((tag) => tag.tagname) : [],
  }));

  const totalPages = Math.ceil(totalItemCount / parseInt(limit));

  return {
    currentPage: parseInt(page),
    totalPages,
    totalItemCount,
    data: transformedStyles,
  };
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
