import { BadRequestException } from '@nestjs/common';
import { HttpErrorFilter } from './http-error-filter';

describe('HttpErrorFilter', () => {
  it('formats HttpException response', () => {
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const response = { status, json };
    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
      }),
    };

    const filter = new HttpErrorFilter();
    filter.catch(new BadRequestException('invalid payload'), host as never);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      message: 'invalid payload',
    });
  });
});
