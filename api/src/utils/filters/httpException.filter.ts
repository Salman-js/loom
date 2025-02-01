import {
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
  ExceptionFilter,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  logger = new Logger();
  configService = new ConfigService();

  constructor() {}
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const message = exception.message;
    const stack = exception.stack;
    this.logger.error(
      `Request: ${request.method} ${request.url} - ${status} - ${message} - ${
        this.configService.get('NODE_ENV') !== 'production' ? stack : ''
      }`,
    );
    const errorDetails = exception.getResponse();
    response.status(status).json({
      statusCode: status,
      message: errorDetails['message'],
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
