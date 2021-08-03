import { Controller, Get, UseGuards } from '@nestjs/common';
import { ColorService } from './color.service';
import { AuthGuard } from '../user/auth.guard';
import { switchCatch } from '../util/switch-catch';

@Controller('color')
export class ColorController {
  constructor(private readonly service: ColorService) {}

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
