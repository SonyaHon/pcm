import { UserRole } from './user.schema';

export class UserCreateDTO {
  username: string;
  password: string;
  role?: UserRole;
}

export class UserLoginDTO {
  username: string;
  password: string;
}
