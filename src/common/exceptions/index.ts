import { ExceptionFilter, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionFilter } from './all-Exception.filter';
import ValidationFilter from './validation.filter';
export const getGlobalFilters = (
  httpAdapter: HttpAdapterHost,
): ExceptionFilter<any>[] => [
  new AllExceptionFilter(httpAdapter),
  new ValidationFilter(),
];