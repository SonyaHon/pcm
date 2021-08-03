import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ModelService } from './model.service';
import { AuthGuard } from '../user/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileStorage } from '../file/file.storage';
import { CreateModelDTO } from './model.dto';
import { switchCatch } from '../util/switch-catch';
import { Size } from './model.schema';

@Controller('model')
export class ModelController {
  constructor(private readonly service: ModelService) {}

  @Post()
  @UseGuards(new AuthGuard())
  @UseInterceptors(FileInterceptor('file', { storage: fileStorage }))
  async createModel(
    @Body() body: CreateModelDTO,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    try {
      await this.service.createModel(
        {
          name: body.name,
          bio: body.bio ?? null,
          penisSize: body.penisSize ? (body.penisSize as Size) : null,
          breastsSize: body.breastsSize ? (body.breastsSize as Size) : null,
          hairColor: body.hairColor ? JSON.parse(body.hairColor) : null,
          eyeColor: body.eyeColor ? JSON.parse(body.eyeColor) : null,
          gender: body.gender ? JSON.parse(body.gender) : null,
          sexualOrientation: body.sexualOrientation
            ? JSON.parse(body.sexualOrientation)
            : null,
          sexualRole: body.sexualRole ? JSON.parse(body.sexualRole) : null,
        },
        file,
      );
    } catch (error) {
      await switchCatch(error, []);
    }
  }
}
