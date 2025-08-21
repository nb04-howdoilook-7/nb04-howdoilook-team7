import postUserService from '../Services/UserService.js';

const UserController = {
  async postUser(req, res) {
    const { email, password, nickname } = req.body;
    const newUser = await postUserService(email, password, nickname);
    res.status(201).json(newUser);
  },
};

export default UserController;
