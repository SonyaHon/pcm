import { Module } from '@nestjs/common';
import { SexualOrientationService } from './sexual-orientation.service';
import { SexualOrientationController } from './sexual-orientation.controller';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SexualOrientation,
  SexualOrientationSchema,
} from './sexual-orientation.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {
        name: SexualOrientation.name,
        schema: SexualOrientationSchema,
      },
    ]),
  ],
  providers: [SexualOrientationService],
  controllers: [SexualOrientationController],
  exports: [SexualOrientationService],
})
export class SexualOrientationModule {}
