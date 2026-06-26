import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';
import { ApiResponse } from '../http/api.response';

type QueryFailedErrorWithCode = QueryFailedError & { code?: string };

@Catch(QueryFailedError)
export class TypeormExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const queryError = exception as QueryFailedErrorWithCode;

    if (queryError.code === '23505') {
      response
        .status(HttpStatus.CONFLICT)
        .json(ApiResponse.fail('Resource already exists'));
      return;
    }

    response
      .status(HttpStatus.BAD_REQUEST)
      .json(ApiResponse.fail('Database operation failed'));
  }
}
