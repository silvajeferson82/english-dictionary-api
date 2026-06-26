import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../http/api.response';

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ReturnType<typeof ApiResponse.success<T>>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ReturnType<typeof ApiResponse.success<T>>> {
    return next.handle().pipe(map((data) => ApiResponse.success(data)));
  }
}
