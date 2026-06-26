import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PayloadToken } from '../../application/models/payload-token.model';

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): PayloadToken => {
    const request = ctx.switchToHttp().getRequest<{ user: PayloadToken }>();

    return request.user;
  },
);
