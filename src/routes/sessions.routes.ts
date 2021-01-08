import { Router } from 'express';

import AuthUserService from '../services/AuthUserService';
import UserMapper from '../mappers/UserMapper';

const sessionsRouter = Router();

sessionsRouter.get('/create', async (request, response) => {
  const { credential, password } = request.body;

  const authUser = new AuthUserService();
  try {
    const { user, token } = await authUser.execute({ credential, password });

    const DTOuser = UserMapper.toDTO(user);

    return response.json({ DTOuser, token });
  } catch (err) {
    return response.status(400).json(err.message);
  }
});

export default sessionsRouter;
