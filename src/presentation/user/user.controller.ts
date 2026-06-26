import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationQueryDto } from '../../application/dtos/shared/pagination-query.dto';
import { GetFavoritesUseCase } from '../../application/use-cases/favorite/get-favorites.use-case';
import { GetHistoryUseCase } from '../../application/use-cases/history/get-history.use-case';
import { GetProfileUseCase } from '../../application/use-cases/user/get-profile.use-case';
import type { PayloadToken } from '../../application/models/payload-token.model';
import { User } from '../../domain/decorators/user.decorator';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly getHistoryUseCase: GetHistoryUseCase,
    private readonly getFavoritesUseCase: GetFavoritesUseCase,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiOkResponse({
    example: {
      id: 'f3a106sa65dv53ab2c1380acef',
      name: 'User 1',
      email: 'example@email.com',
    },
  })
  @ApiBadRequestResponse({ example: { message: 'Error message' } })
  me(@User() user: PayloadToken) {
    return this.getProfileUseCase.execute(user.sub);
  }

  @Get('me/history')
  @ApiOperation({ summary: 'Get authenticated user history' })
  @ApiQuery({ name: 'page', required: false, example: 2 })
  @ApiQuery({ name: 'limit', required: false, example: 4 })
  @ApiOkResponse({
    example: {
      results: [
        { word: 'fire', added: '2024-05-05T19:28:13.531Z' },
        { word: 'firefly', added: '2024-05-05T19:28:44.021Z' },
      ],
      totalDocs: 20,
      page: 2,
      totalPages: 5,
      hasNext: true,
      hasPrev: true,
    },
  })
  @ApiBadRequestResponse({ example: { message: 'Error message' } })
  history(@User() user: PayloadToken, @Query() query: PaginationQueryDto) {
    return this.getHistoryUseCase.execute(user.sub, query.page, query.limit);
  }

  @Get('me/favorites')
  @ApiOperation({ summary: 'Get authenticated user favorites' })
  @ApiQuery({ name: 'page', required: false, example: 2 })
  @ApiQuery({ name: 'limit', required: false, example: 4 })
  @ApiOkResponse({
    example: {
      results: [
        { word: 'fire', added: '2024-05-05T19:30:23.928Z' },
        { word: 'firefly', added: '2024-05-05T19:30:24.088Z' },
      ],
      totalDocs: 20,
      page: 2,
      totalPages: 5,
      hasNext: true,
      hasPrev: true,
    },
  })
  @ApiBadRequestResponse({ example: { message: 'Error message' } })
  favorites(@User() user: PayloadToken, @Query() query: PaginationQueryDto) {
    return this.getFavoritesUseCase.execute(user.sub, query.page, query.limit);
  }
}
