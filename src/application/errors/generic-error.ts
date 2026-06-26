import { HttpException, HttpStatus } from '@nestjs/common';

export class GenericError extends HttpException {
  constructor(message: string, statusCode = HttpStatus.BAD_REQUEST) {
    super(message, statusCode);
  }
}
