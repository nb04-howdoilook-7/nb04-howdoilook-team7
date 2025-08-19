import express from 'express';
import { styleNestedCurationRouter } from './Curation.js';
import { getStyleList, getStyle, putStyle, deleteStyle, postStyle, getTags, postImage } from '../Services/StyleService.js'; // prettier-ignore
import { imageUrlsToImage, addThumbnail } from '../Middlewares/ImagePreprocessor.js'; // prettier-ignore
import hashingPassword from '../Middlewares/hashing.js';
import { styleValidator } from '../Validators/StyleValidator.js';
import { upload } from '../Utils/imageUpload.js';

const styleRouter = express.Router();

styleRouter.use('/:id/curations', styleNestedCurationRouter);

// prettier-ignore
styleRouter.route('/')
    .get(styleValidator(), getStyleList())
    .post(styleValidator(), hashingPassword(), imageUrlsToImage(), addThumbnail(), postStyle());

// prettier-ignore
styleRouter.route('/tags')
    .get(getTags())

// prettier-ignore
styleRouter.route('/images')
    .post(upload.single('image'), styleValidator(), postImage())

// prettier-ignore
styleRouter.route('/:id')
    .get(styleValidator(), getStyle())
    .put(styleValidator(), imageUrlsToImage(), addThumbnail(), putStyle())
    .delete(styleValidator(), deleteStyle());

export default styleRouter;
