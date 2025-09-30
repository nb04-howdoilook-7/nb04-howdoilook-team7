import * as z from 'zod';

export const putSchema = z
  .object({
    password: z.string().min(8, '비밀번호는 최소 8자리 이상이어야 합니다.').optional(),
    currentPassword: z.string().optional(),
    profileImage: z.string().optional(),
    nickname: z.string().optional(),
  })
  .strict();

export const getListSchema = z
  .object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
    pageSize: z.string().regex(/^\d+$/).transform(Number).optional().default(10),
  })
  .strict();
