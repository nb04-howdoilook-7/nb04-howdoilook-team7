import { uploadImage } from '../Libs/cloudinary.js';
import type { ImagePath } from '../types/shared.types.js';

export async function postImageService({ path }: ImagePath) {
  const { secure_url, publicId } = await uploadImage(path);
  return { imageUrl: secure_url, publicId };
}
