import express from 'express';
import { curationNestedCommentRouter } from './Comment.js';
// prettier-ignore
import asyncHandler from '../Middlewares/asyncHandler.js';
import CurationController from '../Controllers/CurationController.js';
import { protect } from '../Middlewares/auth.js';
import {
  validateGetListQuery,
  validatePostBody,
  validatePutBody,
} from '../Middlewares/validators/curations.validators.js';
import { validateId, validateParentId } from '../Middlewares/validators/shared.validators.js';

const styleNestedCurationRouter = express.Router({ mergeParams: true });
const CurationRouter = express.Router();
// prettier-ignore
styleNestedCurationRouter
  .route('/')
  .post(protect(), validatePostBody, asyncHandler(CurationController.postCuration))
  .get(validateGetListQuery, asyncHandler(CurationController.getCurationList));

// prettier-ignore
CurationRouter.route('/:id')
  .put(protect(), validateId, validatePutBody, asyncHandler(CurationController.putCuration))
  .delete(protect(), validateId, asyncHandler(CurationController.deleteCuration));

CurationRouter.use('/:id/comments', validateParentId, curationNestedCommentRouter);

export { styleNestedCurationRouter, CurationRouter };
