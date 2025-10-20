import { z } from 'zod';
import { searchBy } from './SharedSchema.js';

export const postCurationSchema = z.object({
  // 내용이 꼭 필수일 필요는 없을 것 같은데 일단 스키마에 맞춰 정의해두었습니다.
  content: z.string().min(1, '내용은 필수입니다.'),
  trendy: z.number().int().min(0).max(10),
  personality: z.number().int().min(0).max(10),
  practicality: z.number().int().min(0).max(10),
  costEffectiveness: z.number().int().min(0).max(10),
});

export const getListSchema = z
  .object({
    page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
    pageSize: z.string().regex(/^\d+$/).transform(Number).optional().default(10),
    searchBy: z.enum(searchBy).optional().default('nickname'),
    keyword: z.string().optional().default(''),
  })
  .strict();
