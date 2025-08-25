import {
  getStyleService,
  getStyleListService,
  postStyleService,
  putStyleService,
  deleteStyleService,
  getRankingListService,
  postImageService,
} from '../Services/StyleService.js';
import {
  getUserStyleService,
  getUserLikeStyleService,
} from '../Services/UserService.js';

class StyleController {
  async getStyle(req, res) {
    const data = await getStyleService(req.parsedId);
    res.status(200).json(data);
  }
  async getStyleList(req, res) {
    const data = await getStyleListService(req.parsedQuery);
    res.status(200).json(data);
  }
  async postStyle(req, res) {
    const data = await postStyleService(req.userId, req.body);
    res.status(201).json(data);
  }
  async putStyle(req, res) {
    const data = await putStyleService(req.parsedId, req.body);
    res.status(200).json(data);
  }
  async deleteStyle(req, res) {
    const data = await deleteStyleService(req.parsedId);
    res.status(200).json(data);
  }

  async postImage(req, res) {
    const data = await postImageService(req.file);
    res.status(201).json(data);
  }
  async getRankingList(req, res) {
    const data = await getRankingListService(req.parsedQuery);
    res.status(200).json(data);
  }

  async getUserStyle(req, res) {
    const data = await getUserStyleService(req.userId, req.query);
    res.status(200).json(data);
  }
  async getUserLikeStyle(req, res) {
    const data = await getUserLikeStyleService(req.userId, req.query);
    res.status(200).json(data);
  }
}

export default new StyleController();
