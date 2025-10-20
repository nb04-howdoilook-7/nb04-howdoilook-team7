import { postSchema } from '@/schemas/CommentSchema.js';
import createValidator from '../validator.factory.js';

export const validatePostComment = createValidator((req) => {
  postSchema.parse(req.body);
});

export const validatePutComment = createValidator((req) => {
  postSchema.parse(req.body);
});
