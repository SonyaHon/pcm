import { Module, OnModuleInit } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserRole, UserSchema } from './user.schema';
import { ModuleRef } from '@nestjs/core';
import { Config } from '../config';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UserService, AuthGuard],
  controllers: [UserController],
  exports: [UserService, AuthGuard],
})
export class UserModule implements OnModuleInit {
  public static readonly Exception = {
    UserNotFoundException: class extends Error {},
    IncorrectPasswordException: class extends Error {},
  };

  constructor(private readonly moduleRef: ModuleRef) {}

  async onModuleInit() {
    try {
      const userService = this.moduleRef.get<UserService>(UserService);
      await userService.createUser({
        username: Config().app.defaultAdmin.username,
        password: Config().app.defaultAdmin.password,
        role: UserRole.ADMIN,
      });
    } catch (err) {
      if (err.code && err.code == '11000') {
        return;
      }

      console.error(err);
    }
  }
}
