import { compare, hash } from 'bcryptjs';
import { Config } from '../config';

export class PasswordManager {
  static async hash(password: string): Promise<string> {
    return await hash(password, Config().passwordManager.saltRounds);
  }

  static async check(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }
}
