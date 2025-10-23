import express from 'express';
import { protect } from '../Middlewares/auth.js';
import ImageController from '../Controllers/ImageController.js';
import asyncHandler from '../Middlewares/asyncHandler.js';

const ImageRouter = express.Router();

ImageRouter.route('/upload-signature').get(
  protect(),
  asyncHandler(ImageController.postImageRequest)
);

ImageRouter.route('/upload').post(asyncHandler(ImageController.postImage));

export default ImageRouter;
