import express from 'express';
import { styleNestedCurationRouter } from './Curation.js';
import { getStyleListService, getStyleService, putStyleService, deleteStyleService, postStyleService, getTagsService, postImageService } from '../Services/StyleService.js'; // prettier-ignore
import { imageUrlsToImage, addThumbnail } from '../Middlewares/ImagePreprocessor.js'; // prettier-ignore
import hashingPassword from '../Middlewares/hashing.js';
import { styleValidator } from '../Validators/StyleValidator.js';
import { upload } from '../Utils/imageUpload.js';
import asyncHandler from '../Middlewares/asyncHandler.js';
import StyleController from '../Controllers/StyleController.js';

const styleRouter = express.Router();

styleRouter.use('/:id/curations', styleNestedCurationRouter);

// prettier-ignore
styleRouter.route('/')
    .get(styleValidator(), asyncHandler(StyleController.getStyleList))
    .post(styleValidator(), hashingPassword(), imageUrlsToImage(), addThumbnail(), asyncHandler(StyleController.postStyle));

// prettier-ignore
styleRouter.route('/tags')
    .get(asyncHandler(StyleController.getTags))

// prettier-ignore
styleRouter.route('/images')
    .post(upload.single('image'), styleValidator(), asyncHandler(StyleController.postImage))

// prettier-ignore
styleRouter.route('/:id')
    .get(styleValidator(), asyncHandler(StyleController.getStyle))
    .put(styleValidator(), imageUrlsToImage(), addThumbnail(), asyncHandler(StyleController.putStyle))
    .delete(styleValidator(), asyncHandler(StyleController.deleteStyle));

export default styleRouter;
