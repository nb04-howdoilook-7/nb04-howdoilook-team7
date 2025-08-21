import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function postUserService(email, password, nickname) {
  const newUser = await prisma.user.create({
    data: { email, password, nickname },
  });
  return newUser;
}

export default postUserService;
