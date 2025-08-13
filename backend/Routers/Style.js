import express from 'express';
// import curationRouter from 'Curation.js';
import { getStyleList, getStyle, putStyle, deleteStyle, postStyle,  } from '../Services/StyleService.js'; // prettier-ignore

const styleRouter = express.Router();

// styleRouter.use('/:id/curations', curationRouter);

// prettier-ignore
styleRouter.route('/')
    .get(getStyleList())
    .post(postStyle());

// prettier-ignore
styleRouter.route('/:id')
    .get(getStyle())
    .put(putStyle())
    .delete(deleteStyle());

export default styleRouter;
