import * as z from 'zod';
const imageType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const imageSchema = z.object({
  // 이미 multer에서 imagefilter로 거르긴 함함
  mimetype: z.enum(imageType),
  filename: z.string(),
  path: z.string(),
});
