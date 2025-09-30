import { idSchema } from '../../schemas/SharedSchema.js';
import createValidator from '../validator.factory.js';

export const validateId = createValidator((req) => {
  req.parsedId = idSchema.parse(req.params);
});

export const validateParentId = createValidator((req) => {
  // 답글 작성 문제
  // 여기를 수정해야함 parentId로 curationId 이렇게 옴 그냥 id가 아니라
  req.parentId = idSchema.parse(req.params);
});
