import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../user/auth.guard';
import { switchCatch } from '../util/switch-catch';
import { SexualOrientationService } from './sexual-orientation.service';

@Controller('sexual-orientation')
export class SexualOrientationController {
  constructor(private readonly service: SexualOrientationService) {}

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
