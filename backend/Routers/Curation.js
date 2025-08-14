import express from 'express';
//import commentRouter from './Comment.js';
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

//CurationRouter.use('/:id/comments', commentRouter);

export { styleNestedCurationRouter, CurationRouter };
