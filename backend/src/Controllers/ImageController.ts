import type { RequestHandler } from 'express';
import { BadRequestError } from '../Libs/errors.js';
import { hasFile } from '../types/guard.js';
import { postImageService } from '../Services/ImageService.js';

class ImageController {
  postImage: RequestHandler = async (req, res) => {
    if (!hasFile(req)) {
      throw new BadRequestError();
    }
    const { path } = req.file;
    const result = await postImageService({ path });
    return res.status(201).json(result);
  };
}

export default new ImageController();
