import { getTagsService } from '../Services/TagService.js';

class TagController {
  async getTags(req, res) {
    const data = await getTagsService();
    res.status(200).json(data);
  }
}

export default new TagController();
