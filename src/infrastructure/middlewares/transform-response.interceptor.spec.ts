import { ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { TransformResponseInterceptor } from './transform-response.interceptor';

describe('TransformResponseInterceptor', () => {
  it('wraps response in success envelope', (done) => {
    const interceptor = new TransformResponseInterceptor<{ id: string }>();

    interceptor
      .intercept({} as ExecutionContext, { handle: () => of({ id: '1' }) })
      .subscribe((result) => {
        expect(result).toEqual({
          success: true,
          data: { id: '1' },
        });
        done();
      });
  });
});
