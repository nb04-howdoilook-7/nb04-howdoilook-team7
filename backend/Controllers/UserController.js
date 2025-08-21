import { postUserService, loginUserService } from '../Services/UserService.js';

const UserController = {
  async postUser(req, res) {
    const { email, password, nickname } = req.body;
    const newUser = await postUserService(email, password, nickname);
    res.status(201).json(newUser);
  },

  async loginUser(req, res) {
    const { email, password } = req.body;
    const { user, token } = await loginUserService(email, password);
    res.status(200).json({ user, token });
  },
};
export default UserController;
