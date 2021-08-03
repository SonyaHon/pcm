import { Config } from '../config';

export function genMongoUrl(): string {
  const cfg = Config();
  return `mongodb://${cfg.mongo.username}:${cfg.mongo.password}@${cfg.mongo.host}:${cfg.mongo.port}/${cfg.mongo.dbname}?authSource=admin`;
}
