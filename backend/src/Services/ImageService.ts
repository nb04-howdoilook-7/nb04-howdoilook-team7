import { generateUploadSignature } from '@/Libs/cloudinary.js';
import { UnauthorizedError } from '@/Libs/errors.js';
import { v2 as cloudinary } from 'cloudinary';
import type { CloudinaryNotification, CloudinaryWebHook } from '@/types/images.type.js';

export async function postImageRequestService() {
  // 시그니처 키 발급
  const data = generateUploadSignature();
  return data;
}

export async function postImageService({ body, rawBody, timestamp, signature }: CloudinaryWebHook) {
  const isValid = cloudinary.utils.verifyNotificationSignature(rawBody, timestamp, signature);
  if (!isValid) {
    throw new UnauthorizedError('잘못된 서명입니다.');
  }
  // --- 서명 검증 통과 ---
  const notification = body as unknown as CloudinaryNotification;
  console.log('Cloudinary Webhook Received & Verified:', notification);

  // 2. 이미지 업로드 완료 알림인지 확인
  if (notification.notification_type === 'upload' && notification.resource_type === 'image') {
    console.log(`클라우디너리에 저장된 이미지: ${notification.secure_url}`);
  }
  console.log('웹훅 수신완료');
  return '클라우디너리 웹훅 완료';
}
