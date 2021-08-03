import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SexualOrientationDocument = SexualOrientation & Document;

@Schema()
export class SexualOrientation {
  @Prop({ required: true, unique: true })
  name: string;
}

export const SexualOrientationSchema =
  SchemaFactory.createForClass(SexualOrientation);
