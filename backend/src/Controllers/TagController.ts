import type { RequestHandler } from 'express';
import { getTagsService } from '../Services/TagService.js';

class TagController {
  getTags: RequestHandler = async (req, res) => {
    const data = await getTagsService();
    res.status(200).json(data);
  };
}

export default new TagController();
