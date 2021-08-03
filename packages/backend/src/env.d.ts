declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    APP_PORT: string;
    MONGO_INITDB_ROOT_USERNAME: string;
    MONGO_INITDB_ROOT_PASSWORD: string;
    SALT_ROUNDS: string;
    DEFAULT_ADMIN_USERNAME: string;
    DEFAULT_ADMIN_PASSWORD: string;
  }
}
