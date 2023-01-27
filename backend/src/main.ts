import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { WebSocketGateway } from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { SessionGateway } from './modules/session/session.gateway';

function decorateGateway(class_, config: ConfigService) {
  // Just calling the decorator as a function with the class
  // as argument does the same as `@WebSocketGateway`
  WebSocketGateway({
    cors: {
      origin: config.get('WEBSOCKET_CORS_ORIGIN'),
      credentials: true,
    },
  })(class_);
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  decorateGateway(SessionGateway, config);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(4000);
}
bootstrap();
