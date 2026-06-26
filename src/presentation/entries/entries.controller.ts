import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AddFavoriteUseCase } from '../../application/use-cases/favorite/add-favorite.use-case';
import { RemoveFavoriteUseCase } from '../../application/use-cases/favorite/remove-favorite.use-case';
import { SearchWordsUseCase } from '../../application/use-cases/word/search-words.use-case';
import { GetWordDetailUseCase } from '../../application/use-cases/word/get-word-detail.use-case';
import { SearchWordsDto } from '../../application/dtos/word/search-words.dto';
import { User } from '../../domain/decorators/user.decorator';
import type { PayloadToken } from '../../application/models/payload-token.model';
import { CacheInterceptor } from '../../infrastructure/middlewares/cache/cache.interceptor';

@ApiTags('entries')
@ApiBearerAuth()
@Controller('entries/en')
export class EntriesController {
  constructor(
    private readonly searchWordsUseCase: SearchWordsUseCase,
    private readonly getWordDetailUseCase: GetWordDetailUseCase,
    private readonly addFavoriteUseCase: AddFavoriteUseCase,
    private readonly removeFavoriteUseCase: RemoveFavoriteUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List dictionary words with search and pagination' })
  @ApiQuery({ name: 'search', required: false, example: 'fire' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 4 })
  @ApiOkResponse({
    example: {
      results: ['fire', 'firefly', 'fireplace', 'fireman'],
      totalDocs: 20,
      page: 1,
      totalPages: 5,
      hasNext: true,
      hasPrev: false,
    },
  })
  @ApiBadRequestResponse({ example: { message: 'Error message' } })
  search(@Query() query: SearchWordsDto) {
    return this.searchWordsUseCase.execute(query);
  }

  @Get(':word')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({ summary: 'Get word details and register user history' })
  @ApiParam({ name: 'word', example: 'fire' })
  @ApiOkResponse({
    example: [
      {
        word: 'fire',
        phonetics: [{ text: '/faɪə/' }],
        meanings: [
          { partOfSpeech: 'noun', definitions: [{ definition: '...' }] },
        ],
      },
    ],
  })
  @ApiBadRequestResponse({ example: { message: 'Error message' } })
  detail(@Param('word') word: string, @User() user: PayloadToken) {
    return this.getWordDetailUseCase.execute(user.sub, word);
  }

  @Post(':word/favorite')
  @HttpCode(200)
  @ApiOperation({ summary: 'Add word to favorites' })
  @ApiParam({ name: 'word', example: 'fire' })
  @ApiOkResponse({ example: null })
  @ApiBadRequestResponse({ example: { message: 'Error message' } })
  async favorite(@Param('word') word: string, @User() user: PayloadToken) {
    await this.addFavoriteUseCase.execute(user.sub, word);
    return null;
  }

  @Delete(':word/unfavorite')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove word from favorites' })
  @ApiParam({ name: 'word', example: 'fire' })
  @ApiNoContentResponse({ description: 'Removed from favorites' })
  @ApiBadRequestResponse({ example: { message: 'Error message' } })
  async unfavorite(@Param('word') word: string, @User() user: PayloadToken) {
    await this.removeFavoriteUseCase.execute(user.sub, word);
  }
}
