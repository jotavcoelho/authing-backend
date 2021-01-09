import { getRepository } from 'typeorm';

import User from '../models/User';
import UserMapper from '../mappers/UserMapper';

class ShowUserProfileService {
  public async execute(user_id: string): Promise<Omit<User, 'password'>> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { id: user_id } });

    if (!user) {
      throw new Error('Invalid user id');
    }

    const DTOuser = UserMapper.toDTO(user);

    return DTOuser;
  }
}

export default ShowUserProfileService;
