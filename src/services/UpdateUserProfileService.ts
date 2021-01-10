import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';

import User from '../models/User';
import UserMapper from '../mappers/UserMapper';

interface Request {
  user_id: string;
  username: string;
  name?: string;
  email: string;
  current_password?: string;
  new_password?: string;
}

class UpdateUserProfileService {
  public async execute({
    user_id,
    username,
    name,
    email,
    current_password,
    new_password,
  }: Request): Promise<Omit<User, 'password'>> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { id: user_id } });

    if (!user) {
      throw new Error('User does not exist');
    }

    if (user.username !== username) {
      const existingUsername = await usersRepository.findOne({
        where: { username },
      });

      if (existingUsername && user.username !== username) {
        throw new Error('Username already being used');
      }

      user.username = username;
    }

    if (user.email !== email) {
      const existingEmail = await usersRepository.findOne({
        where: { email },
      });

      if (existingEmail && user.email !== email) {
        throw new Error('E-mail already being used');
      }

      user.email = email;
    }

    if (new_password) {
      if (!current_password) {
        throw new Error('Enter your current password in order to change it');
      }

      const currentPasswordMatches = await compare(
        current_password,
        user.password,
      );

      if (!currentPasswordMatches) {
        throw new Error("That's not your current password");
      }

      user.password = new_password;
    }

    user.name = name;

    const newUser = await usersRepository.save(user);

    const DTOnewUser = UserMapper.toDTO(newUser);

    return DTOnewUser;
  }
}

export default UpdateUserProfileService;
