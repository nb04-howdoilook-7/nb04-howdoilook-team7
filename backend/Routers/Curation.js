import express from 'express';
import { curationNestedCommentRouter } from './Comment.js';
// prettier-ignore
import { validatePostCuration, validateUpdateCuration, validateDeleteCuration } from '../Validators/CurationValidator.js';
import hashingPassword from '../Middlewares/hashing.js';
import asyncHandler from '../Middlewares/asyncHandler.js';
import CurationController from '../Controllers/CurationController.js';
import protect from '../Middlewares/auth.js';

const styleNestedCurationRouter = express.Router({ mergeParams: true });
const CurationRouter = express.Router();

// prettier-ignore
styleNestedCurationRouter
  .route('/')
  .post(protect(), validatePostCuration, asyncHandler(CurationController.postCuration))
  .get(asyncHandler(CurationController.getCurationList));

// prettier-ignore
CurationRouter.route('/:id')
  .put(protect(), validateUpdateCuration, asyncHandler(CurationController.putCuration))
  .delete(protect(), validateDeleteCuration, asyncHandler(CurationController.deleteCuration));

CurationRouter.use('/:curationId/comments', curationNestedCommentRouter);

export { styleNestedCurationRouter, CurationRouter };
