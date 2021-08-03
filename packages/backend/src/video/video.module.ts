import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, VIDEO_QUEUE, VideoSchema } from './video.schema';
import { FileModule } from '../file/file.module';
import { VideoProcessor } from './video.processor';
import { BullModule } from '@nestjs/bull';
import { TagModule } from '../tag/tag.module';
import { ModelModule } from '../model/model.module';

@Module({
  imports: [
    UserModule,
    FileModule,
    TagModule,
    ModelModule,
    MongooseModule.forFeature([
      {
        name: Video.name,
        schema: VideoSchema,
      },
    ]),
    BullModule.registerQueue({ name: VIDEO_QUEUE }),
  ],
  providers: [VideoService, VideoProcessor],
  controllers: [VideoController],
})
export class VideoModule {}
