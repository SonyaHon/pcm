import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SexualRole, SexualRoleDocument } from './sexual-role.schema';
import { CreateOrGetSexualRoleDTO } from './sexual-role.dto';

@Injectable()
export class SexualRoleService {
  constructor(
    @InjectModel(SexualRole.name)
    private readonly sexualRoleModel: Model<SexualRoleDocument>,
  ) {}

  async getSexualRoleById(id: string): Promise<SexualRoleDocument> {
    return this.sexualRoleModel.findById(id);
  }

  async createSexualRole(name: string): Promise<SexualRoleDocument> {
    const foundSexualRole = await this.sexualRoleModel.findOne({
      name,
    });
    if (foundSexualRole) return foundSexualRole;

    const sexualRole = new this.sexualRoleModel({
      name,
    });
    return sexualRole.save();
  }

  async getOrCreateSexualRole(
    data: CreateOrGetSexualRoleDTO,
  ): Promise<SexualRoleDocument> {
    if ('id' in data) {
      return this.getSexualRoleById(data.id);
    }
    return this.createSexualRole(data.name);
  }

  async getAll(): Promise<SexualRoleDocument[]> {
    return this.sexualRoleModel.find();
  }
}
