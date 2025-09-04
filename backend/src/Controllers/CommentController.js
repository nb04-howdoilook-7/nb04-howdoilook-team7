import { postCommentService, putCommentService, deleteCommentService } from '../Services/CommentService.js';

class CommentController {
  async postComment(req, res) {
    const data = await postCommentService(req.userId, req.params, req.body);
    res.status(201).json(data);
  }
  async putComment(req, res) {
    const data = await putCommentService(req.userId, req.params, req.body);
    res.status(200).json(data);
  }
  async deleteComment(req, res) {
    const data = await deleteCommentService(req.userId, req.params);
    res.status(200).json(data);
  }
}

export default new CommentController();
