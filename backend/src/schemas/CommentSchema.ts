import { z } from 'zod';

export const postSchema = z
  .object({
    content: z
      .string()
      .min(1, { message: '답글 내용을 작성하세요.' })
      .max(500, { message: '답글 내용은 500자를 초과할 수 없습니다.' }),
  })
  .strict();
