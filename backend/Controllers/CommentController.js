import {postCommentService, putCommentService, deleteCommentService} from '../Services/CommentService.js'; // prettier-ignore

class CommentController {
  async postComment(req, res) {
    const data = await postCommentService(req.params, req.body);
    res.status(201).json(data);
  }
  async putComment(req, res) {
    const data = await putCommentService(req.params, req.body); // prettier-ignore
    res.status(200).json(data);
  }
  async deleteComment(req, res) {
    const data = await deleteCommentService(req.params, req.body);
    res.status(200).json(data);
  }
}

export default new CommentController();
