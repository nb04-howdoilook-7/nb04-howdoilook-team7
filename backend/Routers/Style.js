import express from 'express';
import { styleNestedCurationRouter } from './Curation.js';
import { styleNestedTagRouter } from './Tag.js';
import { imageUrlsToImage, addThumbnail } from '../Middlewares/ImagePreprocessor.js'; // prettier-ignore
import hashingPassword from '../Middlewares/hashing.js';
import { styleValidator } from '../Validators/StyleValidator.js';
import { upload } from '../Utils/imageUpload.js';
import asyncHandler from '../Middlewares/asyncHandler.js';
import StyleController from '../Controllers/StyleController.js';
import protect from '../Middlewares/auth.js';

const userNestedStyleRouter = express.Router({ mergeParams: true });
const styleRouter = express.Router();

styleRouter.use('/:id/curations', styleNestedCurationRouter);
styleRouter.use('/tags', styleNestedTagRouter);

// prettier-ignore
styleRouter.route('/')
    .get(styleValidator(), asyncHandler(StyleController.getStyleList))
    .post(protect(), styleValidator(), imageUrlsToImage(), addThumbnail(), asyncHandler(StyleController.postStyle));

// prettier-ignore
styleRouter.route('/images')
    .post(upload.single('image'), styleValidator(), asyncHandler(StyleController.postImage))

// prettier-ignore
styleRouter.route('/:id')
    .get(styleValidator(), asyncHandler(StyleController.getStyle))
    .put(protect(), styleValidator(), imageUrlsToImage(), addThumbnail(), asyncHandler(StyleController.putStyle))
    .delete(protect(), styleValidator(), asyncHandler(StyleController.deleteStyle));

// prettier-ignore
userNestedStyleRouter.route('/')
    .get(protect(), asyncHandler(StyleController.getUserStyle));

// prettier-ignore
userNestedStyleRouter.route('/likes')
    .get(protect(), asyncHandler(StyleController.getUserLikeStyle));

export { styleRouter, userNestedStyleRouter };
