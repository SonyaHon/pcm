import { Controller, Get, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { AuthGuard } from '../user/auth.guard';
import { switchCatch } from '../util/switch-catch';

@Controller('tag')
export class TagController {
  constructor(private readonly service: TagService) {}

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
