import { getListSchema, postCurationSchema } from '@schemas/CurationSchema.js';
import createValidator from '../validator.factory.js';

export const validatePostBody = createValidator((req) => {
  postCurationSchema.parse(req.body);
});

export const validatePutBody = createValidator((req) => {
  postCurationSchema.partial().parse(req.body);
});

export const validateGetListQuery = createValidator((req) => {
  req.parsedCurationQuery = getListSchema.parse(req.query);
});
