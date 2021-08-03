import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../user/auth.guard';
import { switchCatch } from '../util/switch-catch';
import { SexualRoleService } from './sexual-role.service';

@Controller('sexual-role')
export class SexualRoleController {
  constructor(private readonly service: SexualRoleService) {}

  @Get()
  @UseGuards(new AuthGuard())
  async getAll() {
    try {
      return this.service.getAll();
    } catch (error) {
      await switchCatch(error, []);
    }
  }
}
