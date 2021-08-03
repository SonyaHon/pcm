import { Injectable } from '@nestjs/common';
import { CreateVideoDTO } from './video.dto';
import { Video, VIDEO_QUEUE, VideoDocument } from './video.schema';
import { FileService } from '../file/file.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VideoProcessorTask } from './video.processor';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateOrGetTagDTO } from '../tag/tag.dto';
import { TagService } from '../tag/tag.service';
import { ModelService } from '../model/model.service';

export interface CreateVideoData {
  title: string;
  posterTimestamp: number;
  tags: CreateOrGetTagDTO[];
  models: string[];
}

@Injectable()
export class VideoService {
  constructor(
    private readonly fileService: FileService,
    private readonly tagService: TagService,
    private readonly modelService: ModelService,
    @InjectQueue(VIDEO_QUEUE)
    private readonly videoProcessorQueue: Queue<VideoProcessorTask>,
    @InjectModel(Video.name) private readonly videoModel: Model<VideoDocument>,
  ) {}

  async createVideo(
    data: CreateVideoData,
    file: Express.Multer.File,
  ): Promise<VideoDocument> {
    const pcmFile = await this.fileService.createFile({
      ...file,
      originalName: file.originalname,
    });

    const video = new this.videoModel({
      title: data.title,
      source: pcmFile,
      tags: await this.tagService.getOrCreateTags(data.tags),
    });

    const models = await this.modelService.getByIds(data.models);

    video.models = models;
    await video.save();

    await Promise.all(
      models.map((model) => {
        model.addVideo(video);
      }),
    );

    await this.enqueue(video._id, data.posterTimestamp);

    return video;
  }

  private async enqueue(videoId: string, posterTimestamp: number) {
    await this.videoProcessorQueue.add({
      videoId,
      posterTimestamp,
    });
  }
}
