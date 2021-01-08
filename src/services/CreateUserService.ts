import { getRepository } from 'typeorm';

import User from '../models/User';

interface Request {
  username: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ username, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const userWithSameUsername = await usersRepository.findOne({
      where: { username },
    });

    if (userWithSameUsername) {
      throw new Error('This username is already in use');
    }

    const userWithSameEmail = await usersRepository.findOne({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new Error('This email is already in use');
    }

    const user = usersRepository.create({
      username,
      email,
      password,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
