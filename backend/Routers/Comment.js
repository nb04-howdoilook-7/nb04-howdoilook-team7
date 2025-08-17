import express from 'express';
// prettier-ignore
import { postComment, putComment, deleteComment } from '../Services/CommentService.js';
// prettier-ignore
import { validatePostComment, validatePutComment, validateDeleteComment } from '../Validators/CommentValidator.js';

const curationNestedCommentRouter = express.Router({ mergeParams: true });
const commentRouter = express.Router();

curationNestedCommentRouter.route('/').post(validatePostComment, postComment());

commentRouter
  .route('/:id')
  .put(validatePutComment, putComment())
  .delete(validateDeleteComment, deleteComment());

export { curationNestedCommentRouter, commentRouter };
