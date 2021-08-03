import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../user/auth.guard';
import { switchCatch } from '../util/switch-catch';
import { GenderService } from './gender.service';

@Controller('gender')
export class GenderController {
  constructor(private readonly service: GenderService) {}

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
