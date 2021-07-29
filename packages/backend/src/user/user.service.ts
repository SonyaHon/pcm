import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { User, UserRole } from './user.domain';
import { PasswordHasher } from '../util/password-hasher';
import { UserRepositoryAdapter } from './user.repository-adapter';
import { UserModule } from './user.module';

export interface UserCreateParams {
  username: string;
  password: string;
  role?: UserRole;
}

export interface UserGetByCredentialsParams {
  username: string;
  password: string;
}

@Injectable()
export class UserService {
  constructor(
    private readonly passwordHasher: PasswordHasher,
    private readonly repositoryAdapter: UserRepositoryAdapter,
  ) {}

  async createUser(data: UserCreateParams): Promise<User> {
    const id = uuid();
    const username = data.username;
    const password = await this.passwordHasher.hash(data.password);
    const role = data.role ?? UserRole.GUEST;

    const user = new User({
      id,
      username,
      password,
      role,
    });

    await this.repositoryAdapter.save(user);

    return user;
  }

  async getUserByCredentials(
    credentials: UserGetByCredentialsParams,
  ): Promise<User> {
    const user = await this.repositoryAdapter.getByUsername(
      credentials.username,
    );

    if (
      !(await this.passwordHasher.check(credentials.password, user.password))
    ) {
      throw new UserModule.Exception.UserNotFound();
    }

    return user;
  }

  async getUserById(id: string): Promise<User> {
    return this.repositoryAdapter.getById(id);
  }
}
