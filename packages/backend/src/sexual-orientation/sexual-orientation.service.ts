import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  SexualOrientation,
  SexualOrientationDocument,
} from './sexual-orientation.schema';
import { CreateOrGetSexualOrientationDTO } from './sexual-orientation.dto';

@Injectable()
export class SexualOrientationService {
  constructor(
    @InjectModel(SexualOrientation.name)
    private readonly sexualOrientationModel: Model<SexualOrientationDocument>,
  ) {}

  async getSexualOrientationById(
    id: string,
  ): Promise<SexualOrientationDocument> {
    return this.sexualOrientationModel.findById(id);
  }

  async createSexualOrientation(
    name: string,
  ): Promise<SexualOrientationDocument> {
    const foundSexualOrientation = await this.sexualOrientationModel.findOne({
      name,
    });
    if (foundSexualOrientation) return foundSexualOrientation;

    const sexualOrientation = new this.sexualOrientationModel({
      name,
    });
    return sexualOrientation.save();
  }

  async getOrCreateSexualOrientation(
    data: CreateOrGetSexualOrientationDTO,
  ): Promise<SexualOrientationDocument> {
    if ('id' in data) {
      return this.getSexualOrientationById(data.id);
    }
    return this.createSexualOrientation(data.name);
  }

  async getAll(): Promise<SexualOrientationDocument[]> {
    return this.sexualOrientationModel.find();
  }
}
