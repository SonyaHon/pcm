import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PCMFileDocument = PCMFile & Document;

@Schema()
export class PCMFile {
  @Prop({ required: true, unique: true })
  path: string;

  @Prop({ required: false, index: false })
  originalName: string;

  @Prop({ required: true, index: false })
  mimetype: string;

  @Prop({ required: true, index: false })
  size: number;
}

export const PCMFileSchema = SchemaFactory.createForClass(PCMFile);
