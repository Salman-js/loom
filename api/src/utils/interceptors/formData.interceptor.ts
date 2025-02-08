import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FormDataInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    if (request.headers['content-type']?.includes('multipart/form-data')) {
      const body = {};
      for (const key in request.body) {
        if (request.body?.hasOwnProperty?.(key)) {
          body[key] = request.body[key];
        }
      }
      request.body = body;
    }

    return next.handle();
  }
}
