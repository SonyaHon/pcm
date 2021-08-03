import { Process, Processor } from '@nestjs/bull';
import { Video, VIDEO_QUEUE, VideoDocument } from './video.schema';
import { Job } from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Ffmpeg from 'fluent-ffmpeg';
import { FfprobeData } from 'fluent-ffmpeg';
import { FileService } from '../file/file.service';
import { v4 as uuid } from 'uuid';
import { join } from 'path';
import { Config } from '../config';
import { unlink } from 'fs-extra';

export interface VideoProcessorTask {
  videoId: string;
  posterTimestamp: number;
}

@Processor(VIDEO_QUEUE)
export class VideoProcessor {
  constructor(
    private readonly fileService: FileService,
    @InjectModel(Video.name) private readonly videoModel: Model<VideoDocument>,
  ) {}

  private async getFileInfo(path: string): Promise<FfprobeData> {
    return new Promise<FfprobeData>((resolve, reject) => {
      Ffmpeg.ffprobe(path, (error, data) => {
        if (!error) {
          resolve(data);
        } else {
          reject(error);
        }
      });
    });
  }

  private async createPoster(path: string, timestamp: number): Promise<string> {
    const cmd = Ffmpeg(path);
    const id = uuid();
    const filename = `${id}.jpg`;
    const filepath = join(Config().fileStorage.destination, filename);
    try {
      return new Promise<string>((resolve, reject) => {
        cmd
          .on('error', (err) => reject(err))
          .on('end', () => resolve(filepath))
          .screenshots({
            timestamps: [timestamp],
            size: Config().fileStorage.posterSize,
            filename,
            folder: Config().fileStorage.destination,
          });
      });
    } catch (error) {
      console.error(error);
    }
  }

  private static calculateCropDurationAndCount(videoDuration: number): {
    cropDuration: number;
    cropCount: number;
  } {
    const threeMinutes = 60 * 3;
    const twentyMinutes = 60 * 20;

    let cropCount = 5;
    let cropDuration = 5;

    if (videoDuration <= threeMinutes) {
      cropCount = 3;
      cropDuration = 3;
    } else if (videoDuration <= twentyMinutes) {
      cropCount = 5;
      cropDuration = 3;
    }

    return {
      cropCount,
      cropDuration,
    };
  }

  private async createCrop(
    path: string,
    from: number,
    to: number,
  ): Promise<string> {
    const cmd = Ffmpeg(path);
    const id = uuid();
    const filename = `${id}.mp4`;
    const filepath = join(Config().fileStorage.destination, filename);

    try {
      return new Promise((resolve, reject) => {
        cmd
          .on('error', (err) => reject(err))
          .on('end', () => resolve(filepath))
          .noAudio()
          .size(Config().fileStorage.posterSize)
          .seek(from)
          .duration(to - from)
          .save(filepath);
      });
    } catch (error) {
      console.error(error);
    }
  }

  private async createCrops(
    path: string,
    cropDuration: number,
    cropCount: number,
    videoDuration: number,
  ): Promise<string[]> {
    const result = [];

    const timeBetweenCrops = Math.floor(videoDuration / cropCount);

    for (let i = 0; i < cropCount; i++) {
      const from = i * timeBetweenCrops;
      const to = Math.min(from + cropDuration, videoDuration);
      result.push(await this.createCrop(path, from, to));
    }

    return result;
  }

  private async mergeCrops(crops: string[]): Promise<string> {
    const cmd = Ffmpeg();
    const id = uuid();
    const filename = `${id}.mp4`;
    const filepath = join(Config().fileStorage.destination, filename);

    try {
      return new Promise((resolve, reject) => {
        cmd
          .on('error', (err) => reject(err))
          .on('end', () => resolve(filepath));

        crops.forEach((crop) => cmd.addInput(crop));

        cmd.mergeToFile(filepath);
      });
    } catch (error) {
      console.error(error);
    }
  }

  private async deleteCrops(crops: string[]): Promise<void> {
    await Promise.all(crops.map((crop) => unlink(crop)));
  }

  private async createPreview(path: string, duration: number): Promise<string> {
    const { cropDuration, cropCount } =
      VideoProcessor.calculateCropDurationAndCount(duration);

    const crops = await this.createCrops(
      path,
      cropDuration,
      cropCount,
      duration,
    );
    const previewPath = await this.mergeCrops(crops);
    await this.deleteCrops(crops);

    return previewPath;
  }

  async setVideoDetails(video: VideoDocument) {
    const { path } = video.source;
    const info = await this.getFileInfo(path);
    video.length = info.format.duration;
    await video.save();
  }

  async setVideoPoster(video: VideoDocument, posterTimestamp: number) {
    const { path } = video.source;
    const posterPath = await this.createPoster(path, posterTimestamp);

    const fileInfo = await this.getFileInfo(posterPath);

    video.poster = await this.fileService.createFile({
      path: posterPath,
      originalName: null,
      size: fileInfo.format.size,
      mimetype: `image/jpeg`,
    });
    await video.save();
  }

  async setVideoPreview(video: VideoDocument) {
    const { path } = video.source;
    const {
      format: { duration },
    } = await this.getFileInfo(path);

    const previewPath = await this.createPreview(path, duration);
    const previewInfo = await this.getFileInfo(previewPath);

    video.preview = await this.fileService.createFile({
      path: previewPath,
      originalName: null,
      size: previewInfo.format.size,
      mimetype: `video/mp4`,
    });
    await video.save();
  }

  @Process()
  async process(job: Job<VideoProcessorTask>) {
    const video = await this.videoModel
      .findById(job.data.videoId)
      .populate('source');
    if (!video) return;

    await Promise.all([
      this.setVideoDetails(video),
      this.setVideoPoster(video, job.data.posterTimestamp),
      this.setVideoPreview(video),
    ]);
  }
}
