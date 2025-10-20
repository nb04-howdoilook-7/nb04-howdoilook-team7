import { getListSchema, getRankingSchema, postSchema } from '@/schemas/StylesSchema.js';
import createValidator from '../validator.factory.js';

export const validatePostBody = createValidator((req) => {
  postSchema.parse(req.body);
});

export const validatePutBody = createValidator((req) => {
  postSchema.partial().parse(req.body);
});

export const validateGetListQuery = createValidator((req) => {
  req.parsedQuery = getListSchema.parse(req.query);
});

export const validateRankQuery = createValidator((req) => {
  req.parsedRankQuery = getRankingSchema.parse(req.query);
});
