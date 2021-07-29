import { Injectable } from '@nestjs/common';
import { User } from './user.domain';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModule } from './user.module';

@Injectable()
export class UserRepositoryAdapter {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save(user: User): Promise<void> {
    const entity = UserEntity.FromDomain(user);
    await this.userRepository.save(entity);
  }

  async getByUsername(username: string): Promise<User> {
    const entity = await this.userRepository.findOne({
      username,
    });

    if (!entity) {
      throw new UserModule.Exception.UserNotFound();
    }

    return entity.toDomain();
  }

  async getById(id: string): Promise<User> {
    const entity = await this.userRepository.findOne({
      id,
    });

    if (!entity) {
      throw new UserModule.Exception.UserNotFound();
    }

    return entity.toDomain();
  }
}
