import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { UtilModule } from './util/util.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from './config';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [
    UserModule,
    UtilModule,
    TypeOrmModule.forRoot({
      ...Config.orm,
      entities: [UserEntity],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
