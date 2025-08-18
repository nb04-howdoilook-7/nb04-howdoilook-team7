import express from 'express';
import { curationNestedCommentRouter } from './Comment.js';
// prettier-ignore
import { getCurationList, postCuration, putCuration, deleteCuration } from '../Services/CurationService.js';
// prettier-ignore
import { validatePostCuration, validateUpdateCuration, validateDeleteCuration } from '../Validators/CurationValidator.js';
import hashingPassword from '../Middlewares/hashing.js';
const styleNestedCurationRouter = express.Router({ mergeParams: true });
const CurationRouter = express.Router();

// prettier-ignore
styleNestedCurationRouter
  .route('/')
  .post(validatePostCuration, hashingPassword(), postCuration())
  .get(getCurationList());

// prettier-ignore
CurationRouter.route('/:id')
  .put(validateUpdateCuration, putCuration())
  .delete(validateDeleteCuration, deleteCuration());

CurationRouter.use('/:curationId/comments', curationNestedCommentRouter);

export { styleNestedCurationRouter, CurationRouter };
