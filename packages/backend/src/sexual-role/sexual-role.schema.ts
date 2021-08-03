import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SexualRoleDocument = SexualRole & Document;

@Schema()
export class SexualRole {
  @Prop({ required: true, unique: true })
  name: string;
}

export const SexualRoleSchema = SchemaFactory.createForClass(SexualRole);
