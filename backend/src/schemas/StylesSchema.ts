import * as z from 'zod';
import { rankBy, searchBy, sortBy } from './SharedSchema.js';

// prettier-ignore
const categoryInfo = z.object({
  name: z.string(),
  brand: z.string(),
  price: z.number().nonnegative(),
}).strict();

// prettier-ignore
const categories = z.object({
  top: categoryInfo.optional(),
  bottom: categoryInfo.optional(),
  outer: categoryInfo.optional(),
  dress: categoryInfo.optional(),
  shoes: categoryInfo.optional(),
  bag: categoryInfo.optional(),
  accessory: categoryInfo.optional(),
}).strict();

export const postSchema = z
  .object({
    title: z.string().min(1, '제목을 입력해주세요.'),
    content: z.string().min(1, '내용을 입력해주세요.'),
    categories,
    tags: z
      .array(z.string())
      .min(1, '태그를 최소 1개 이상 입력해주세요.')
      // 태그 배열의 각 항목에서 공백을 제거하고 빈 문자열을 필터링합니다.
      .transform((tags) => tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0))
      // refine으로 추가 유효성 검사
      .refine((tags) => tags.length > 0, '유효한 태그가 제공되어야 합니다.'),
    Image: z
      .array(
        z.object({
          url: z.string(),
          publicId: z.string(),
        })
      )
      .min(1),
  })
  .strict();

// prettier-ignore
export const getListSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
  pageSize: z.string().regex(/^\d+$/).transform(Number).optional().default(10),
  sortBy: z.enum(sortBy).optional().default('latest'),
  searchBy: z.enum(searchBy).optional().default('nickname'),
  keyword: z.string().optional(),
  tag: z.string().optional(),
}).strict();

// prettier-ignore
export const getRankingSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
  pageSize: z.string().regex(/^\d+$/).transform(Number).optional().default(10),
  rankBy: z.enum(rankBy).optional().default('total'),
}).strict();
