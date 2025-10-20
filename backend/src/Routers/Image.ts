import express from 'express';
import { protect } from '../Middlewares/auth.js';
import { upload } from '../Libs/imageUpload.js';
import { validateImage } from '../Middlewares/validators/images.validators.js';
import ImageController from '../Controllers/ImageController.js';
import asyncHandler from '../Middlewares/asyncHandler.js';

const ImageRouter = express.Router();

ImageRouter.route('/').post(
  protect(),
  upload.single('image'),
  validateImage,
  asyncHandler(ImageController.postImage)
);

export default ImageRouter;
