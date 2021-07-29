import { omit } from 'lodash';

export enum UserRole {
  GUEST = 'GUEST',
  ADMIN = 'ADMIN',
}

export interface UserData {
  id: string;
  username: string;
  password: string;
  role: UserRole;
}

export interface UserSession {
  userId: string;
  loggedIn: boolean;
}

export class User {
  public id: string;
  public username: string;
  public password: string;
  public role: UserRole;

  constructor({ id, username, password, role }: UserData) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.role = role;
  }

  getWithoutSensitiveData(): Partial<UserData> {
    return omit(JSON.parse(JSON.stringify(this)), 'password');
  }
}
