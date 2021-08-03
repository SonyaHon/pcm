import { Module, OnModuleInit } from '@nestjs/common';
import { FileService } from './file.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PCMFile, PCMFileSchema } from './file.schema';
import { ensureDir } from 'fs-extra';
import { Config } from '../config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PCMFile.name,
        schema: PCMFileSchema,
      },
    ]),
  ],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule implements OnModuleInit {
  async onModuleInit() {
    await ensureDir(Config().fileStorage.destination);
  }
}
