import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';
import { FileModule } from '../file/file.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Model, ModelSchema } from './model.schema';
import { UserModule } from '../user/user.module';
import { ColorModule } from '../color/color.module';
import { GenderModule } from '../gender/gender.module';
import { SexualOrientationModule } from '../sexual-orientation/sexual-orientation.module';
import { SexualRoleModule } from '../sexual-role/sexual-role.module';

@Module({
  imports: [
    FileModule,
    UserModule,
    ColorModule,
    GenderModule,
    SexualOrientationModule,
    SexualRoleModule,
    MongooseModule.forFeature([
      {
        name: Model.name,
        schema: ModelSchema,
      },
    ]),
  ],
  providers: [ModelService],
  controllers: [ModelController],
  exports: [ModelService],
})
export class ModelModule {}
