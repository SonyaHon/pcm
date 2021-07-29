import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserModule } from './user.module';
import { User, UserSession } from './user.domain';
import { AuthGuard } from './auth.guard';
import { switchError } from '../lib/switch-error';

export interface LoginDTO {
  username: string;
  password: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async login(
    @Body() body: LoginDTO,
    @Session() session: UserSession,
  ): Promise<Partial<User> | undefined> {
    try {
      const user = await this.userService.getUserByCredentials({
        username: body.username,
        password: body.password,
      });

      session.userId = user.id;
      session.loggedIn = true;

      return user.getWithoutSensitiveData();
    } catch (e) {
      switchError(e, [
        {
          case: UserModule.Exception.UserNotFound,
          callback: () => {
            throw new HttpException(
              'Username or Password is incorrect',
              HttpStatus.FORBIDDEN,
            );
          },
        },
      ]);
    }
  }

  @UseGuards(AuthGuard)
  async getSelf(
    @Session() session: UserSession,
  ): Promise<Partial<User> | undefined> {
    try {
      const user = await this.userService.getUserById(session.userId);
      return user.getWithoutSensitiveData();
    } catch (e) {
      switchError(e, [
        {
          case: UserModule.Exception.UserNotFound,
          callback: () => {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
          },
        },
      ]);
    }
  }

  @UseGuards(AuthGuard)
  async logout(@Session() session: UserSession): Promise<void> {
    session.loggedIn = false;
  }
}
