import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';

interface Request {
  username: string;
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({
    username,
    name,
    email,
    password,
  }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const usernameIsAnEmail =
      username.includes('@') && username.endsWith('.com');

    if (usernameIsAnEmail) {
      throw new Error(
        'Please note that the username is not supposed to be an e-mail',
      );
    }

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

    const hashedPassword = await hash(password, 8);

    const user = usersRepository.create({
      username,
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
