import { Module } from '@nestjs/common';
import { GenderService } from './gender.service';
import { GenderController } from './gender.controller';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Gender, GenderSchema } from './gender.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {
        name: Gender.name,
        schema: GenderSchema,
      },
    ]),
  ],
  providers: [GenderService],
  controllers: [GenderController],
  exports: [GenderService],
})
export class GenderModule {}
