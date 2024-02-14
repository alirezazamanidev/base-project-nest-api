import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { deleteFilesInPublic } from '../utils';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus: number, message: string;
    const req = ctx.getRequest();
    // delete image if validation error
    deleteFilesInPublic(req);

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      message = exception.message;
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      message = new InternalServerErrorException().message;
    }
    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      errors: {
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
        message,
        data: [],
      },
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
