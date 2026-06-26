import { QueryFailedError } from 'typeorm';
import { TypeormExceptionFilter } from './typeorm-exception-filter';

describe('TypeormExceptionFilter', () => {
  it('maps unique violation to conflict', () => {
    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const response = { status, json };
    const host = {
      switchToHttp: () => ({
        getResponse: () => response,
      }),
    };
    const error = new QueryFailedError('', [], new Error('duplicate')) as QueryFailedError & {
      code: string;
    };
    error.code = '23505';

    const filter = new TypeormExceptionFilter();
    filter.catch(error, host as never);

    expect(status).toHaveBeenCalledWith(409);
    expect(json).toHaveBeenCalledWith({
      message: 'Resource already exists',
    });
  });
});
