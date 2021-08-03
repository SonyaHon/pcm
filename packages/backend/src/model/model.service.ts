import { Injectable } from '@nestjs/common';
import { FileService } from '../file/file.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ModelDocument, Size } from './model.schema';
import { Model as MongooseModel } from 'mongoose';
import { CreateOrGetColorDTO } from '../color/color.dto';
import { ColorService } from '../color/color.service';
import { GenderService } from '../gender/gender.service';
import { CreateOrGetGenderDTO } from '../gender/gender.dto';
import { CreateOrGetSexualOrientationDTO } from '../sexual-orientation/sexual-orientation.dto';
import { SexualOrientationService } from '../sexual-orientation/sexual-orientation.service';
import { CreateOrGetSexualRoleDTO } from '../sexual-role/sexual-role.dto';
import { SexualRoleService } from '../sexual-role/sexual-role.service';

export interface CreateModelData {
  name: string;
  bio: string | null;
  penisSize: Size | null;
  breastsSize: Size | null;
  hairColor: CreateOrGetColorDTO | null;
  eyeColor: CreateOrGetColorDTO | null;
  gender: CreateOrGetGenderDTO | null;
  sexualOrientation: CreateOrGetSexualOrientationDTO | null;
  sexualRole: CreateOrGetSexualRoleDTO | null;
}

@Injectable()
export class ModelService {
  constructor(
    private readonly fileService: FileService,
    private readonly colorService: ColorService,
    private readonly genderService: GenderService,
    private readonly sexualOrientationService: SexualOrientationService,
    private readonly sexualRoleService: SexualRoleService,
    @InjectModel(Model.name) private readonly modelModel: MongooseModel<Model>,
  ) {}

  async createModel(
    data: CreateModelData,
    file: Express.Multer.File,
  ): Promise<ModelDocument> {
    const poster = await this.fileService.createFile({
      ...file,
      originalName: file.originalname,
    });

    const model = new this.modelModel({
      name: data.name,
      bio: data.bio,
      penisSize: data.penisSize,
      breastsSize: data.breastsSize,
      hairColor: data.hairColor
        ? await this.colorService.getOrCreateColor(data.hairColor)
        : null,
      eyeColor: data.eyeColor
        ? await this.colorService.getOrCreateColor(data.eyeColor)
        : null,
      gender: data.gender
        ? await this.genderService.getOrCreateGender(data.gender)
        : null,
      sexualOrientation: data.sexualOrientation
        ? await this.sexualOrientationService.getOrCreateSexualOrientation(
            data.sexualOrientation,
          )
        : null,
      sexualRole: data.sexualRole
        ? await this.sexualRoleService.getOrCreateSexualRole(data.sexualRole)
        : null,
      poster,
    });

    return await model.save();
  }

  async getByIds(models: string[]): Promise<ModelDocument[]> {
    return this.modelModel.find({
      _id: { $in: models },
    });
  }
}
