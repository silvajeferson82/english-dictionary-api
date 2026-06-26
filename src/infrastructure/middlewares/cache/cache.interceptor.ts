import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Observable, of, tap } from 'rxjs';
import { CacheService } from './cache.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context
      .switchToHttp()
      .getRequest<{ method: string; originalUrl: string }>();
    const res = context.switchToHttp().getResponse<Response>();
    const startedAt = Date.now();
    const cacheKey = this.cacheService.generateKey(req.method, req.originalUrl);
    const ttlMs = this.configService.getOrThrow<number>('cache.ttlMs');
    const cached = this.cacheService.get<unknown>(cacheKey);

    if (cached) {
      res.setHeader('x-cache', 'HIT');
      res.setHeader('x-response-time', `${Date.now() - startedAt}ms`);
      return of(cached);
    }

    res.setHeader('x-cache', 'MISS');
    return next.handle().pipe(
      tap((data) => {
        this.cacheService.set(cacheKey, data, ttlMs);
        res.setHeader('x-response-time', `${Date.now() - startedAt}ms`);
      }),
    );
  }
}
