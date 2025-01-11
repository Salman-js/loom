import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { WrapperI18nService } from 'src/modules/wrapper-i18n/wrapper-i18n.service';

@Injectable()
@Catch(Prisma.PrismaClientKnownRequestError)
export class DatabaseFilter implements ExceptionFilter {
  logger = new Logger('DatabaseFilter');

  constructor(private readonly i18n: WrapperI18nService) {}

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
        message = this.i18n.t('database.P2002', { lang: locale }) as string;
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = this.i18n.t('database.P2025', { lang: locale }) as string;
        break;
      case 'P2003':
        status = HttpStatus.FORBIDDEN;
        message = this.i18n.t('database.P2003', { lang: locale }) as string;
        break;
      case 'P2004':
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = this.i18n.t('database.P2004', { lang: locale }) as string;
        break;
      case 'P2015':
        status = HttpStatus.TOO_MANY_REQUESTS;
        message = this.i18n.t('database.P2015', {
          lang: locale,
        }) as string;
        break;
      case 'P2016':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = this.i18n.t('database.P2016', { lang: locale }) as string;
        break;
      case 'P2023':
        status = HttpStatus.FORBIDDEN;
        message = this.i18n.t('database.P2023', { lang: locale }) as string;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = this.i18n.t('database.default', { lang: locale }) as string;
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
