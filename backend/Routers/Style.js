import express from 'express';
import { styleNestedCurationRouter } from './Curation.js';
import { getStyleList, getStyle, putStyle, deleteStyle, postStyle,  } from '../Services/StyleService.js'; // prettier-ignore
import { imageUrlsToImage, addThumbnail } from '../Middlewares/ImagePreprocessor.js'; // prettier-ignore
import categoryFilter from '../Middlewares/CategoryFilter.js';

const styleRouter = express.Router();

styleRouter.use('/:id/curations', styleNestedCurationRouter);

// prettier-ignore
styleRouter.route('/')
    .get(getStyleList())
    .post(categoryFilter(), imageUrlsToImage(), addThumbnail(), postStyle());

// prettier-ignore
styleRouter.route('/:id')
    .get(getStyle())
    .put(categoryFilter(), imageUrlsToImage(), addThumbnail(), putStyle())
    .delete(deleteStyle());

export default styleRouter;
