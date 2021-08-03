import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PCMFile, PCMFileDocument } from '../file/file.schema';
import { Tag, TagDocument } from '../tag/tag.schema';
import { Model, ModelDocument } from '../model/model.schema';

export type VideoDocument = Video & mongoose.Document;

export const VIDEO_QUEUE = 'video-processor-queue';

@Schema()
export class Video {
  @Prop({ index: false })
  title: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: () => PCMFile,
  })
  source: PCMFileDocument;

  @Prop({ required: false })
  length: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: () => Tag }],
    required: true,
  })
  tags: TagDocument[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => PCMFile })
  poster: PCMFileDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => PCMFile })
  preview: PCMFileDocument;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: () => Model }] })
  models: ModelDocument[];
}

export const VideoSchema = SchemaFactory.createForClass(Video);
