import { Injectable } from '@nestjs/common';
import { User, UserDocument, UserRole } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCreateDTO, UserLoginDTO } from './user.dto';
import { PasswordManager } from '../util/password-manager';
import { UserModule } from './user.module';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(data: UserCreateDTO): Promise<UserDocument> {
    const username = data.username;
    const password = await PasswordManager.hash(data.password);
    const role = data.role || UserRole.GUEST;

    const user = new this.userModel({
      username,
      password,
      role,
    });

    return await user.save();
  }

  async getUserById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    return user;
  }

  async validateUserCredentials(data: UserLoginDTO): Promise<UserDocument> {
    const user: UserDocument = await this.userModel.findOne({
      username: data.username,
    });

    if (!user) {
      throw new UserModule.Exception.UserNotFoundException();
    }

    if (!(await PasswordManager.check(data.password, user.password))) {
      throw new UserModule.Exception.IncorrectPasswordException();
    }

    return user;
  }
}
