import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UserLoginDTO } from './user.dto';
import { UserService } from './user.service';
import { switchCatch } from '../util/switch-catch';
import { UserModule } from './user.module';
import { UserSession } from './user.schema';
import { AuthGuard } from './auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('/login')
  async login(@Body() body: UserLoginDTO, @Session() session: UserSession) {
    try {
      const user = await this.service.validateUserCredentials(body);

      session.loggedIn = true;
      session.user = {
        id: user._id,
      };

      return user.removeSensitiveData();
    } catch (error) {
      await switchCatch(error, [
        {
          instance: UserModule.Exception.UserNotFoundException,
          callback: (e) => {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
          },
        },
        {
          instance: UserModule.Exception.IncorrectPasswordException,
          callback: () => {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
          },
        },
      ]);
    }
  }

  @Get('/me')
  @UseGuards(new AuthGuard())
  async getSelf(@Session() session: UserSession) {
    const user = await this.service.getUserById(session.user.id);
    return user.removeSensitiveData();
  }
}
