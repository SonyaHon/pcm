import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PCMFile, PCMFileDocument } from './file.schema';
import { Model } from 'mongoose';

export interface CreateFileParams {
  path: string;
  originalName: string | null;
  mimetype: string;
  size: number;
}

@Injectable()
export class FileService {
  constructor(
    @InjectModel(PCMFile.name)
    private readonly fileModel: Model<PCMFileDocument>,
  ) {}

  async createFile(fileData: CreateFileParams): Promise<PCMFileDocument> {
    const pcmFile = new this.fileModel(fileData);
    return pcmFile.save();
  }
}
