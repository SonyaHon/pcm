import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gender, GenderDocument } from './gender.schema';
import { CreateOrGetGenderDTO } from './gender.dto';

@Injectable()
export class GenderService {
  constructor(
    @InjectModel(Gender.name)
    private readonly genderModel: Model<GenderDocument>,
  ) {}

  async getGenderById(id: string): Promise<GenderDocument> {
    return this.genderModel.findById(id);
  }

  async createGender(name: string): Promise<GenderDocument> {
    const foundGender = await this.genderModel.findOne({
      name,
    });
    if (foundGender) return foundGender;

    const gender = new this.genderModel({
      name,
    });
    return gender.save();
  }

  async getOrCreateGender(data: CreateOrGetGenderDTO): Promise<GenderDocument> {
    if ('id' in data) {
      return this.getGenderById(data.id);
    }
    return this.createGender(data.name);
  }

  async getAll(): Promise<GenderDocument[]> {
    return this.genderModel.find();
  }
}
