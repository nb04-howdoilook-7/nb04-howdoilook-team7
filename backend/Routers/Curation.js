import express from 'express';
import { curationNestedCommentRouter } from './Comment.js';
// prettier-ignore
import { getCurationList, postCuration, putCuration, deleteCuration } from '../Services/CurationService.js';

const styleNestedCurationRouter = express.Router({ mergeParams: true });
const CurationRouter = express.Router();

// prettier-ignore
styleNestedCurationRouter.route('/')
  .post(postCuration())
  .get(getCurationList());

// prettier-ignore
CurationRouter.route('/:id')
  .put(putCuration())
  .delete(deleteCuration());

CurationRouter.use('/:id/comments', curationNestedCommentRouter);

export { styleNestedCurationRouter, CurationRouter };
