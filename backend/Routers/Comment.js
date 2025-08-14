import express from 'express';
// prettier-ignore
import { postComment, putComment, deleteComment } from '../Services/CommentService.js';
// prettier-ignore
import { validateCommentId, validateCreateComment, validateUpdateComment, validateCurationId } from '../Validators/CommentValidator.js';

const curationNestedCommentRouter = express.Router({ mergeParams: true });
const commentRouter = express.Router();

// prettier-ignore
curationNestedCommentRouter.route('/')
  .post(validateCurationId, validateCreateComment, postComment());

// prettier-ignore
commentRouter.route('/:id')
  .put(validateCommentId, validateUpdateComment, putComment())
  .delete(validateCommentId, deleteComment());

export { curationNestedCommentRouter, commentRouter };
