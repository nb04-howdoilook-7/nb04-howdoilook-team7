import { imageSchema } from '@schemas/ImageSchema.js';
import createValidator from '../validator.factory.js';

export const validateImage = createValidator((req) => {
  imageSchema.parse(req.file);
});
