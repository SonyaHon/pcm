import { Injectable } from '@nestjs/common';

import { hash, compare } from 'bcryptjs';
import { Config } from '../config';

@Injectable()
export class PasswordHasher {
  async hash(password: string): Promise<string> {
    return await hash(password, Config.passwordHasher.saltRounds);
  }

  async check(password: string, hashedValue: string): Promise<boolean> {
    return await compare(password, hashedValue);
  }
}
