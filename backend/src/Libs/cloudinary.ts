import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from './constants.js';
import { InternalServerError } from './errors.js';

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export function generateUploadSignature() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = { timestamp, folder: 'team7_images_tsMigration' };

    const signature = cloudinary.utils.api_sign_request(paramsToSign, CLOUDINARY_API_SECRET);

    return {
      timestamp,
      signature,
      apiKey: CLOUDINARY_API_KEY,
      cloudName: CLOUDINARY_CLOUD_NAME,
      folder: paramsToSign.folder, // 프론트엔드 전달용
    };
  } catch (error) {
    console.error('Cloudinary 서명 생성 실패:', error);
    throw new InternalServerError('이미지 업로드 준비 중 오류가 발생했습니다.');
  }
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
