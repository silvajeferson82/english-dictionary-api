import { HttpStatus } from '@nestjs/common';
import { GenericError } from './generic-error';

describe('GenericError', () => {
  it('returns status and message', () => {
    const error = new GenericError('business error', HttpStatus.CONFLICT);

    expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
    expect(error.message).toBe('business error');
  });
});
