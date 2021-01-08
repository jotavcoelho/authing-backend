// this might be worthless, will check something later

import User from '../models/User';

class UserMapper {
  // public static toDomain(): User {}

  // public static toPersistence(): User {}

  public static toDTO(user: User): Omit<User, 'password'> {
    const { id, username, email, created_at, updated_at } = user;

    return {
      id,
      username,
      email,
      created_at,
      updated_at,
    };
  }
}

export default UserMapper;
