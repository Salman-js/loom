import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

/**
 * Middleware for logging HTTP requests and responses.
 */
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('Response');

  constructor() {}

  /**
   * Handles the incoming request and logs the request details and response details.
   * @param req - The incoming request object.
   * @param res - The outgoing response object.
   * @param next - The next function to be called in the middleware chain.
   * @returns void
   * @example use(req, res, next) { ... } // logs the request and response details
   */
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl: url, body, query, params } = req;
    const userAgent = req.get('user-agent') || '';
    const requestTime = new Date().getTime();
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const responseTime = new Date().getTime() - requestTime;
      this.logger.log(
        `${method} ${url} ${statusCode} - ${responseTime}ms - ${JSON.stringify(body)} - ${JSON.stringify(query)} - ${JSON.stringify(params)}`,
      );
    });
    next();
  }
}

// `${method} ${url} ${statusCode} ${contentLength} - ${responseTime}ms - ${userAgent} - ${JSON.stringify(body)} - ${JSON.stringify(query)} - ${JSON.stringify(params)}`,
