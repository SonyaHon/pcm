import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UtilModule } from '../util/util.module';
import { UserController } from './user.controller';
import { AuthGuard } from './auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';

@Module({
  imports: [UtilModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [UserService, AuthGuard],
  controllers: [UserController],
  exports: [UserService, AuthGuard],
})
export class UserModule {
  static Exception = {
    UserNotFound: class extends Error {},
  };
}
