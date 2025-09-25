import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from './constants.js';

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// Cloudinary URL에서 public_id를 추출
export function extractPublicIdFromCloudinaryUrl(url: string) {
  const parts = url.split('/upload/');
  if (parts.length > 1) {
    const pathWithVersion = parts[1];
    const publicIdWithExtension = pathWithVersion.split('/').slice(1).join('/');
    return publicIdWithExtension.substring( 0, publicIdWithExtension.lastIndexOf('.')); // prettier-ignore
  }
  return null;
}

export function deletionList(existingImages) {
  return existingImages.map(async (image) => {
    const publicId = extractPublicIdFromCloudinaryUrl(image.url);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Cloudinary에서 이미지 ${publicId} 삭제 성공`);
      } catch (e) {
        console.error(`Cloudinary에서 이미지 ${publicId} 삭제 실패: ${e.message}`);
      }
    }
  });
}

export async function deletionSingle(existingImage: string) {
  const publicId = extractPublicIdFromCloudinaryUrl(existingImage);
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
      console.log(`Cloudinary에서 이미지 ${publicId} 삭제 성공`);
    } catch (e) {
      console.error(`Cloudinary에서 이미지 ${publicId} 삭제 실패: ${e.message}`);
    }
  }
}
