import type { RequestHandler } from 'express';
import { postImageRequestService, postImageService } from '@/Services/ImageService.js';
import { BadRequestError } from '@/Libs/errors.js';

class ImageController {
  postImageRequest: RequestHandler = async (req, res) => {
    const result = await postImageRequestService();
    return res.status(201).json(result);
  };
  postImage: RequestHandler = async (req, res) => {
    const signature = req.headers['x-cld-signature'] as string;
    const timestampHeader = req.headers['x-cld-timestamp'];
    const rawBody = req.rawBody?.toString();

    if (!signature || !timestampHeader || !rawBody) {
      throw new BadRequestError('필수 헤더 또는 본문이 누락되었습니다.');
    }
    const timestampString = Array.isArray(timestampHeader) ? timestampHeader[0] : timestampHeader;
    if (!timestampString) {
      throw new BadRequestError('올바르지 않은 타임 스탬프프');
    }
    const timestamp = parseInt(timestampString, 10); // 10진수로 변환

    // 3. 변환된 숫자가 유효한지 확인 (선택적이지만 안전)
    if (isNaN(timestamp)) {
      throw new BadRequestError('유효하지 않은 타임스탬프 헤더입니다.');
    }
    const result = await postImageService({ body: req.body, rawBody, signature, timestamp });
    return res.status(201).json(result);
  };
}

export default new ImageController();
