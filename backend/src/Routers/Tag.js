import express from 'express';
import asyncHandler from '../Middlewares/asyncHandler.js';
import TagController from '../Controllers/TagController.js';

const styleNestedTagRouter = express.Router({ mergeParams: true });

styleNestedTagRouter.route('/').get(asyncHandler(TagController.getTags));

export { styleNestedTagRouter };
