import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Config, ENVIRONMENT } from './config';

import * as bodyParser from 'body-parser';
import * as Session from 'express-session';
import * as MongoStoreFactory from 'connect-mongodb-session';
import { genMongoUrl } from './util/gen-mongo-url';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (Config().env === ENVIRONMENT.DEVELOPMENT) {
    app.enableCors();
  }

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const MongoDBStore = MongoStoreFactory(Session);
  const store = new MongoDBStore({
    uri: genMongoUrl(),
    collection: 'sessions',
  });

  app.use(
    Session({
      secret: Config().session.secret,
      resave: false,
      saveUninitialized: false,
      store,
    }),
  );

  await app.listen(Config().app.port);
}
bootstrap().catch((error) => console.error(error));
