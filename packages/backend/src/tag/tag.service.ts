import { Injectable } from '@nestjs/common';
import { CreateOrGetTagDTO } from './tag.dto';
import { Tag, TagDocument } from './tag.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag.name) private readonly tagModel: Model<TagDocument>,
  ) {}

  async getTagById(id: string): Promise<TagDocument> {
    return this.tagModel.findById(id);
  }

  async createTag(name: string): Promise<TagDocument> {
    const foundTag = await this.tagModel.findOne({
      name,
    });
    if (foundTag) return foundTag;

    const tag = new this.tagModel({
      name,
    });
    return tag.save();
  }

  async getOrCreateTag(data: CreateOrGetTagDTO): Promise<TagDocument> {
    if ('id' in data) {
      return this.getTagById(data.id);
    }
    return this.createTag(data.name);
  }

  async getOrCreateTags(data: CreateOrGetTagDTO[]): Promise<TagDocument[]> {
    return Promise.all(data.map((dt) => this.getOrCreateTag(dt)));
  }

  async getAll(): Promise<TagDocument[]> {
    return this.tagModel.find();
  }
}
