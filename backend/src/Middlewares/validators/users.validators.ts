import { getListSchema, putSchema } from '../../schemas/UserSchema.js';
import createValidator from '../validator.factory.js';

export const validatePutBody = createValidator((req) => {
  putSchema.partial().parse(req.body);
});

export const validateGetListQuery = createValidator((req) => {
  req.parsedUserQuery = getListSchema.parse(req.query);
});
