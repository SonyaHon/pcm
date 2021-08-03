import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDTO } from './video.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from '../file/file.storage';
import { AuthGuard } from '../user/auth.guard';
import { switchCatch } from '../util/switch-catch';

@Controller('video')
export class VideoController {
  constructor(private readonly service: VideoService) {}

  @Post()
  @UseGuards(new AuthGuard())
  @UseInterceptors(FileInterceptor('file', { storage: fileStorage }))
  async createVideo(
    @Body() body: CreateVideoDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      await this.service.createVideo(
        {
          title: body.title,
          posterTimestamp: parseFloat(body.posterTimestamp),
          tags: JSON.parse(body.tags),
          models: JSON.parse(body.models),
        },
        file,
      );
    } catch (error) {
      await switchCatch(error, []);
    }
  }
}
