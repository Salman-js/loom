import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
@Catch(Prisma.PrismaClientKnownRequestError)
export class DatabaseFilter implements ExceptionFilter {
  logger = new Logger('DatabaseFilter');

  constructor() {}

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest(); // to get the locale from the request

    const locale = request.headers['accept-language'] || 'en';

    let status: HttpStatus;
    let message: string;

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        message = 'database.P2002';
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = 'database.P2025';
        break;
      case 'P2003':
        status = HttpStatus.FORBIDDEN;
        message = 'database.P2003';
        break;
      case 'P2004':
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = 'database.P2004';
        break;
      case 'P2015':
        status = HttpStatus.TOO_MANY_REQUESTS;
        message = 'database.P2015';
        break;
      case 'P2016':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'database.P2016';
        break;
      case 'P2023':
        status = HttpStatus.FORBIDDEN;
        message = 'database.P2023';
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'database.default';
    }

    const errorResponse = {
      statusCode: status,
      message: message,
      error: exception.code,
    };

    this.logger.error(`Error Code: ${exception.code}, Message: ${message}`);
    response.status(status).json(errorResponse);
  }
}
