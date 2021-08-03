import { Module } from '@nestjs/common';
import { SexualRoleController } from './sexual-role.controller';
import { SexualRoleService } from './sexual-role.service';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SexualRole, SexualRoleSchema } from './sexual-role.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: SexualRole.name, schema: SexualRoleSchema },
    ]),
  ],
  providers: [SexualRoleService],
  controllers: [SexualRoleController],
  exports: [SexualRoleService],
})
export class SexualRoleModule {}
