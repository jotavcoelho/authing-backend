import { Router } from 'express';

import CreateUserService from '../services/CreateUserService';

import UserMapper from '../mappers/UserMapper';

const usersRouter = Router();

usersRouter.post('/create', async (request, response) => {
  const { username, name, email, password } = request.body;

  const createUser = new CreateUserService();

  try {
    const user = await createUser.execute({ username, name, email, password });

    const DTOuser = UserMapper.toDTO(user);

    return response.json(DTOuser);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default usersRouter;
