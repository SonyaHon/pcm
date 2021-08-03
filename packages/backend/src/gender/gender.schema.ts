import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type GenderDocument = Gender & Document;

@Schema()
export class Gender {
  @Prop({ required: true, unique: true })
  name: string;
}

export const GenderSchema = SchemaFactory.createForClass(Gender);
