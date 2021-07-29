import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const Config = {
  passwordHasher: {
    saltRounds: 12,
  },
  orm: {
    type: 'sqlite',
    database: 'devdb.sqlite',
  } as TypeOrmModuleOptions,
};
