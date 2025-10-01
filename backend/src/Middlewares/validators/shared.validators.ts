import { idSchema } from '../../schemas/SharedSchema.js';
import createValidator from '../validator.factory.js';

export const validateId = createValidator((req) => {
  req.parsedId = idSchema.parse(req.params);
});

export const validateParentId = createValidator((req) => {
  req.parentId = idSchema.parse(req.params);
});
