import { Router } from 'express';
import multer from 'multer';

import CreateUserService from '../services/CreateUserService';
import UpdateAvatarService from '../services/UpdateAvatarService';
import checkAuthentication from '../middlewares/checkAuthentication';

import UserMapper from '../mappers/UserMapper';

import uploadConfig from '../config/upload';

const usersRouter = Router();

const upload = multer(uploadConfig);

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

usersRouter.use(checkAuthentication);

usersRouter.get('/auth', async (request, response) => {
  return response.json({ message: 'AUTHENTICATED ROUTE' });
});

usersRouter.patch(
  '/avatar',
  upload.single('avatar'),
  async (request, response) => {
    try {
      const updateAvatar = new UpdateAvatarService();

      const DTOuser = await updateAvatar.execute({
        user_id: request.user.id,
        avatarFilename: request.file.filename,
      });

      return response.json(DTOuser);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },
);

export default usersRouter;
