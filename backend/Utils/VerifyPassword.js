import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// prettier-ignore
export default async function verifyPassword(id, inputPassword) { 
    const style = await prisma.style.findUniqueOrThrow({
        where: {id},
        select: {
            password: true,
        }
    })
    // 비교 대상 password는 평문 이어야함
    // inputPassword -> 평문
    // style.password -> db에 저장된 해시
    const isMatch = await bcrypt.compare(inputPassword, style.password);
    return isMatch;
}
