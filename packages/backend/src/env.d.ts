declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    MONGO_INITDB_ROOT_USERNAME: string;
    MONGO_INITDB_ROOT_PASSWORD: string;
    MONGO_DB_NAME: string;
    MONGO_HOST: string;
    MONGO_PORT: string;
    APP_PORT: string;
    SALT_ROUNDS: string;
    DEFAULT_ADMIN_USERNAME: string;
    DEFAULT_ADMIN_PASSWORD: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
  }
}
