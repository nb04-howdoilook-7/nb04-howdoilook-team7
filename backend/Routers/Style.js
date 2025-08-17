import express from 'express';
import { styleNestedCurationRouter } from './Curation.js';
import { getStyleList, getStyle, putStyle, deleteStyle, postStyle,  } from '../Services/StyleService.js'; // prettier-ignore
import { imageUrlsToImage, addThumbnail } from '../Middlewares/ImagePreprocessor.js'; // prettier-ignore
import hashingPassword from '../Middlewares/hashing.js';
import { styleValidator } from '../Validators/StyleValidator.js';

const styleRouter = express.Router();

styleRouter.use('/:id/curations', styleNestedCurationRouter);

// prettier-ignore
styleRouter.route('/')
    .get(styleValidator(), getStyleList())
    .post(styleValidator(), hashingPassword(), imageUrlsToImage(), addThumbnail(), postStyle());

// prettier-ignore
styleRouter.route('/:id')
    .get(styleValidator(), getStyle())
    .put(styleValidator(), imageUrlsToImage(), addThumbnail(), putStyle())
    .delete(styleValidator(), deleteStyle());

export default styleRouter;
