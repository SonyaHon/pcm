import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Color, ColorDocument } from './color.schema';
import { Model } from 'mongoose';
import { CreateOrGetColorDTO } from './color.dto';

@Injectable()
export class ColorService {
  constructor(
    @InjectModel(Color.name)
    private readonly colorModel: Model<ColorDocument>,
  ) {}

  async getColorById(id: string): Promise<ColorDocument> {
    return this.colorModel.findById(id);
  }

  async createColor(name: string): Promise<ColorDocument> {
    const foundColor = await this.colorModel.findOne({
      name,
    });
    if (foundColor) return foundColor;

    const color = new this.colorModel({
      name,
    });
    return color.save();
  }

  async getOrCreateColor(data: CreateOrGetColorDTO): Promise<ColorDocument> {
    if ('id' in data) {
      return this.getColorById(data.id);
    }
    return this.createColor(data.name);
  }

  async getAll(): Promise<ColorDocument[]> {
    return this.colorModel.find();
  }
}
