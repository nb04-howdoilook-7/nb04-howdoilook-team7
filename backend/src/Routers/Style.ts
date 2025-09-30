import express from 'express';
import { styleNestedCurationRouter } from './Curation.js';
import { styleNestedTagRouter } from './Tag.js';
import asyncHandler from '../Middlewares/asyncHandler.js';
import StyleController from '../Controllers/StyleController.js';
import { protect, optionalProtect } from '../Middlewares/auth.js';
import {
  validateGetListQuery,
  validatePostBody,
  validatePutBody,
} from '../Middlewares/validators/styles.validators.js';
import { validateId, validateParentId } from '../Middlewares/validators/shared.validators.js';

const userNestedStyleRouter = express.Router({ mergeParams: true });
const styleRouter = express.Router();

styleRouter.use('/:id/curations', validateParentId, styleNestedCurationRouter);
styleRouter.use('/tags', styleNestedTagRouter);
// prettier-ignore
styleRouter
  .route('/')
  .get(validateGetListQuery, asyncHandler(StyleController.getStyleList))
  .post(protect(), validatePostBody, asyncHandler(StyleController.postStyle));
// prettier-ignore
styleRouter.route('/:id/like')
    .post(protect(), validateId, asyncHandler(StyleController.toggleStyleLike));

// prettier-ignore
styleRouter.route('/:id')
    .get(optionalProtect(), validateId, asyncHandler(StyleController.getStyle))
    .put(protect(), validateId, validatePutBody, asyncHandler(StyleController.putStyle))
    .delete(protect(), validateId, asyncHandler(StyleController.deleteStyle));

userNestedStyleRouter.route('/').get(protect(), asyncHandler(StyleController.getUserStyle));

export { styleRouter, userNestedStyleRouter };
