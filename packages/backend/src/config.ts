import { join } from 'path';

export enum ENVIRONMENT {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export const Config = () => ({
  env: (process.env.NODE_ENV || 'development') as ENVIRONMENT,
  mongo: {
    username: process.env.MONGO_INITDB_ROOT_USERNAME || 'dev',
    password: process.env.MONGO_INITDB_ROOT_PASSWORD || 'dev',
    host: process.env.MONGO_HOST || 'mongodb',
    port: parseInt(process.env.MONGO_PORT) || 27017,
    dbname: process.env.MONGO_DB_NAME || 'devapp',
  },
  passwordManager: {
    saltRounds: parseInt(process.env.SALT_ROUNDS) || 12,
  },
  app: {
    port: parseInt(process.env.APP_PORT) || 9292,
    defaultAdmin: {
      username: process.env.DEFAULT_ADMIN_USERNAME || 'root',
      password: process.env.DEFAULT_ADMIN_PASSWORD || 'root',
    },
  },
  session: {
    secret: 'dev-secret',
  },
  fileStorage: {
    destination: join(__dirname, 'uploads'),
    posterSize: '?x400',
  },
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT) || 6379,
  },
});
