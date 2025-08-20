import {
  getStyleService,
  getStyleListService,
  postStyleService,
  putStyleService,
  deleteStyleService,
  getRankingListService,
  getTagsService,
  postImageService,
} from '../Services/StyleService.js';

class StyleController {
  async getStyle(req, res) {
    const { id } = req.parsedId;
    const data = await getStyleService(id);
    res.status(200).json(data);
  }
  async getStyleList(req, res) {
    // 파라미터 기본 값 설정
    const { page, pageSize, sortBy, searchBy, keyword, tag = null } = req.parsedQuery; // prettier-ignore
    const data = await getStyleListService(page, pageSize, sortBy, searchBy, keyword, tag) // prettier-ignore
    res.status(200).json(data);
  }
  async postStyle(req, res) {
    // 기존 이미지 타입 전달, 카테고리 필터링을 위한 구조 분해
    const { imageUrls, Image, ...others } = req.body;
    const data = await postStyleService(imageUrls, Image, others);
    res.status(201).json(data);
  }
  async putStyle(req, res) {
    // post와 동일한 전처리 과정들
    // 기존 이미지 타입 전달, 카테고리 필터링을 위한 구조 분해
    const { imageUrls, Image, password, ...others } = req.body;
    const { id } = req.parsedId;
    const data = putStyleService(imageUrls, Image, password, id, others);
    res.status(200).json(data);
  }
  async deleteStyle(req, res) {
    const { id } = req.parsedId;
    const { password } = req.body;
    const data = deleteStyleService(id, password);
    res.status(200).json(data);
  }

  async postImage(req, res) {
    const { path } = req.file;
    const data = await postImageService(path);
    res.status(201).json(data);
  }
  async getTags(req, res) {
    const data = await getTagsService();
    res.status(200).json(data);
  }
  async getRankingList(req, res) {
    const { page, pageSize, rankBy } = req.parsedQuery;
    const data = await getRankingListService(page, pageSize, rankBy);
    res.status(200).json(data);
  }
}

export default new StyleController();
