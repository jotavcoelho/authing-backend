import { Router } from 'express';

import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

usersRouter.get('/create', async (request, response) => {
  const { username, email, password } = request.body;

  const CreateUser = new CreateUserService();

  try {
    const user = await CreateUser.execute({ username, email, password });

    return response.json(user);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default usersRouter;
