// prettier-ignore
import { putUserService, deleteUserService, getUserInfoService, getUserLikeStyleService,} from '../Services/UserService.js';

class UserController {
  async getUserInfo(req, res) {
    const data = await getUserInfoService(req.userId);
    res.status(201).json(data);
  }
  async putUserInfo(req, res) {
    const data = await putUserService(req.userId, req.body);
    res.status(200).json(data);
  }
  async deleteUser(req, res) {
    const data = await deleteUserService(req.userId, req.body);
    res.status(200).json(data);
  }
  async getUserLikeStyle(req, res) {
    const data = await getUserLikeStyleService(req.userId, req.query);
    res.status(200).json(data);
  }
}

export default new UserController();
