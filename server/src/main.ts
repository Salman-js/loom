import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { AppModule } from './app.module';
import { apiReference } from '@scalar/nestjs-api-reference';
import winstonLoggerInstance from './utils/filters/logger/logger.util';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TimeoutInterceptor } from './utils/interceptors/timeout.interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({ instance: winstonLoggerInstance }),
  });
  const configService = app.get(ConfigService);
  const logger = new Logger('bootstrap');

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Specify allowed HTTP methods
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'refreshtoken',
    ],
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  const environment = configService.get('NODE_ENV');
  if (environment !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Loom - API')
      .setDescription('Backend API for Loom.')

      .setVersion('v1.0')
      // .addBearerAuth(
      //   { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      //   'accessToken',
      // )
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
      .build();

    const document = SwaggerModule.createDocument(app, config);

    app.use('/openapi.json', (req, res) => res.json(document));
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      // forbidNonWhitelisted: true,
    }),
  );

  if (environment !== 'production') {
    app.use(
      '/explorer',
      apiReference({
        theme: 'purple',
        spec: {
          url: '/openapi.json',
        },
      }),
    );
  }

  app.use('/uploads', express.static('uploads'));

  app.useGlobalInterceptors(new TimeoutInterceptor());
  await app.listen(8000).then(() => {
    process.env.NODE_ENV === 'production'
      ? logger.verbose(`Server running on port 8000`)
      : logger.verbose(`Server running on port 8000`);

    logger.verbose(`Environment: ${environment}`);
    process.env.NODE_ENV !== 'production' &&
      logger.verbose(`Swagger running on http://localhost:8000/explorer`);
  });
}
bootstrap();
