import * as z from 'zod';

export const sortBy = ['latest', 'mostViewed', 'mostCurated', 'mostLiked'] as const;
export const searchBy = ['nickname', 'title', 'content', 'tag'] as const;
export const rankBy = ['total', 'trendy', 'personality', 'practicality', 'costEffectiveness' ] as const; // prettier-ignore

export const idSchema = z
  .object({
    id: z.coerce.number().int({ message: 'ID는 정수여야 합니다.' }),
  })
  .strict();
