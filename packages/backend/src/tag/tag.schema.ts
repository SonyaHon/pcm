import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TagDocument = Tag & Document;

@Schema()
export class Tag {
  @Prop({ unique: true, required: true })
  name: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
