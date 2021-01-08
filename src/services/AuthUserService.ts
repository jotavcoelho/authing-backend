import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';

interface Request {
  credential: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthUserService {
  public async execute({ credential, password }: Request): Promise<Response> {
    // I don't think we should check if it's an email or not
    // we can just use that .findOne looking for an user with X email or username
    // since we already make sure that the username is not an email when creating a user
    // yeah, it should work
    // const credentialIsEmail =
    //   credential.includes('@') && credential.endsWith('.com');
    // if (credentialIsEmail) {
    // } else {
    // }
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({
      where: [{ email: credential }, { username: credential }],
    }); // this looks for an user where either the email or username is the same as the credential

    if (!user) {
      throw new Error('Wrong username/e-mail and password combination');
    }

    const passwordMatches = await compare(password, user.password);

    if (!passwordMatches) {
      throw new Error('Wrong username/e-mail and password combination');
    }

    const token = sign({}, 'a9a6091ba540a9ba32a1a9bdcacb01f3', {
      subject: user.id,
      expiresIn: '7d',
    });

    return { user, token };
  }
}

export default AuthUserService;
