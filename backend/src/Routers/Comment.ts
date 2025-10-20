import express from 'express';
import {
  validatePostComment,
  validatePutComment,
} from '../Middlewares/validators/comments.validators.js';
import asyncHandler from '../Middlewares/asyncHandler.js';
import CommentController from '../Controllers/CommentController.js';
import { protect } from '../Middlewares/auth.js';
import { validateId } from '../Middlewares/validators/shared.validators.js';

const curationNestedCommentRouter = express.Router({ mergeParams: true });
const commentRouter = express.Router();

curationNestedCommentRouter
  .route('/')
  .post(protect(), validatePostComment, asyncHandler(CommentController.postComment));

commentRouter
  .route('/:id')
  .put(protect(), validateId, validatePutComment, asyncHandler(CommentController.putComment))
  .delete(protect(), validateId, asyncHandler(CommentController.deleteComment));

export { curationNestedCommentRouter, commentRouter };
