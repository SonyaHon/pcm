import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { ColorController } from './color.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Color, ColorSchema } from './color.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {
        name: Color.name,
        schema: ColorSchema,
      },
    ]),
  ],
  providers: [ColorService],
  controllers: [ColorController],
  exports: [ColorService],
})
export class ColorModule {}
