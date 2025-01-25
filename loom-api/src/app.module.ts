import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  OnModuleInit,
} from '@nestjs/common';
import { DatabaseService } from './modules/database/database.service';
import { LoggingMiddleware } from './utils/filters/logger/logger.middleware';
import { DatabaseModule } from './modules/database/database.module';
import { configModule } from './config/config.module';
import { clsModule } from './config/cls.config';
import { FeatureModule } from './feature.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './utils/filters/httpException.filter';
import { DatabaseFilter } from './utils/filters/database.filter';
import { UserModule } from './modules/user/user.module';
import { BookModule } from './modules/book/book.module';

@Module({
  imports: [
    DatabaseModule,
    configModule,
    clsModule,
    FeatureModule,
    UserModule,
    BookModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DatabaseFilter,
    },
  ],
})
export class AppModule implements NestMiddleware, OnModuleInit {
  private readonly logger = new Logger(AppModule.name); // Create logger instance directly

  constructor(private readonly database: DatabaseService) {}

  use() {
    throw new Error('Method not implemented.');
  }

  onModuleInit() {
    this.logger.log('The module has been initialized.');
    const dbConnection = this.database.checkConnection();
    if (!dbConnection) {
      this.logger.error('Database connection failed.');
    }
    this.logger.log('Database connection successful.');
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
    consumer
      .apply((req, res, next) => {
        if (req.url.startsWith('/socket.io')) {
          return res.status(404).send('WebSocket is not supported.');
        }
        next();
      })
      .forRoutes('*');
  }
}
