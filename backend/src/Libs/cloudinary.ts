import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from './constants.js';
import fs from 'fs';
import { InternalServerError } from './errors.js';

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export async function uploadImage(path: string) {
  const { secure_url, public_id } = await cloudinary.uploader.upload(path, {
    folder: 'team7_images_tsMigration',
  });
  fs.unlinkSync(path);
  console.log('Cloudinary에 이미지 업로드 완료');
  return { secure_url, publicId: public_id };
}

export function deletionList(publicIds: string[]) {
  return publicIds.map(async (publicId) => {
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Cloudinary에서 이미지 ${publicId} 삭제 성공`);
      } catch (err) {
        if (err instanceof Error) {
          // 타입 가드
          throw new InternalServerError(
            `Cloudinary에서 이미지 ${publicId} 삭제 실패: ${err.message}`
          );
        }
        throw new InternalServerError(
          `Cloudinary에서 이미지 ${publicId} 삭제 중 알 수 없는 에러 발생: ${String(err)}`
        );
      }
    }
  });
}

export async function deletionSingle(publicId: string) {
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
      console.log(`Cloudinary에서 이미지 ${publicId} 삭제 성공`);
    } catch (err) {
      if (err instanceof Error) {
        // 타입 가드
        throw new InternalServerError(
          `Cloudinary에서 이미지 ${publicId} 삭제 실패: ${err.message}`
        );
      }
      throw new InternalServerError(
        `Cloudinary에서 이미지 ${publicId} 삭제 중 알 수 없는 에러 발생: ${String(err)}`
      );
    }
  }
}
