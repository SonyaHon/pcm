import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ColorDocument = Color & Document;

@Schema()
export class Color {
  @Prop({ required: true, unique: true })
  name: string;
}

export const ColorSchema = SchemaFactory.createForClass(Color);
