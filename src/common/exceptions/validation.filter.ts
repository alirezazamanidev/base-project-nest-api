import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse, ErrorType } from 'src/common/types/public.type';
import ValidationException from './validation.exception';
import { deleteFilesInPublic } from '../utils';

@Catch(ValidationException)
export default class ValidationFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res: Response = ctx.getResponse<Response>();
    const req = ctx.getRequest();
    // delete images if validation error
    deleteFilesInPublic(req);

    let statusCode: HttpStatus;
    let errorMessage: ErrorType;
    let invalidParams: ErrorType;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      errorMessage = exception.message;

      const errors = [];
      exception.validationErrors.forEach((err) => {
        const keys = Object.keys(err);
        errors.push({ [keys[0]]: err[keys[0]][0] });
      });
      invalidParams = errors;
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = new InternalServerErrorException().message;
      invalidParams = {};
    }
    const errorResponse: ErrorResponse = {
      statusCode,
      errors: {
        title: errorMessage,
        invalidParams,
      },
    };
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
}
