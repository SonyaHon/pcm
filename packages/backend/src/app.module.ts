import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { genMongoUrl } from './util/gen-mongo-url';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';
import { VideoModule } from './video/video.module';
import { ModelModule } from './model/model.module';
import { FileModule } from './file/file.module';
import { BullModule } from '@nestjs/bull';
import { Config } from './config';
import { GenderModule } from './gender/gender.module';
import { ColorModule } from './color/color.module';
import { SexualRoleModule } from './sexual-role/sexual-role.module';
import { SexualOrientationModule } from './sexual-orientation/sexual-orientation.module';

@Module({
  imports: [
    MongooseModule.forRoot(genMongoUrl(), { useNewUrlParser: true }),
    BullModule.forRoot({
      redis: {
        host: Config().redis.host,
        port: Config().redis.port,
      },
    }),
    UserModule,
    TagModule,
    VideoModule,
    ModelModule,
    FileModule,
    GenderModule,
    ColorModule,
    SexualOrientationModule,
    SexualRoleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
