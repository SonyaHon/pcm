import { NestFactory } from '@nestjs/core';
import * as Session from 'express-session';
import { AppModule } from './app.module';
import { Config } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    Session({
      secret: Config.session.secret,
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(3000);
}
bootstrap().catch((error: Error) => console.error(error));
