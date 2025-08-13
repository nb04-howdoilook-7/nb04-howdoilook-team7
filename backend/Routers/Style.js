import express from 'express';

const styleRouter = express.Router();

// prettier-ignore
styleRouter.route('/')
    .get(getStyle())
    .post(postStyle());

// prettier-ignore
styleRouter.route('/:id')
    .get()
    .put()
    .delete();
