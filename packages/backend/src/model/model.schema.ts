import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { PCMFile, PCMFileDocument } from '../file/file.schema';
import { Color, ColorDocument } from '../color/color.schema';
import { Gender, GenderDocument } from '../gender/gender.schema';
import {
  SexualOrientation,
  SexualOrientationDocument,
} from '../sexual-orientation/sexual-orientation.schema';
import {
  SexualRole,
  SexualRoleDocument,
} from '../sexual-role/sexual-role.schema';
import { Video, VideoDocument } from '../video/video.schema';

export type ModelDocument = Model & Document;

export enum Size {
  TINY = 'TINY',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  BIG = 'BIG',
  GIANT = 'GIANT',
}

@Schema()
export class Model {
  @Prop({ index: false })
  name: string;

  @Prop({ index: false, required: false })
  bio: string;

  @Prop({ index: false, required: false })
  breastsSize: Size;

  @Prop({ index: false, required: false })
  penisSize: Size;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Gender })
  gender: GenderDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: () => Color,
  })
  hairColor: ColorDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: () => Color,
  })
  eyeColor: ColorDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => SexualRole })
  sexualRole: SexualRoleDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => SexualOrientation })
  sexualOrientation: SexualOrientationDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => PCMFile })
  poster: PCMFileDocument;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: () => Video }] })
  videos: VideoDocument[];

  addVideo: (video: VideoDocument) => Promise<void>;
}

export const ModelSchema = SchemaFactory.createForClass(Model);

ModelSchema.methods.addVideo = async function (
  video: VideoDocument,
): Promise<void> {
  if (!this.videos.includes(video._id)) {
    this.videos.push(video);
    await this.save();
  }
} as (video: VideoDocument) => Promise<void> & ThisType<ModelDocument>;
