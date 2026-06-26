import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../domain/decorators/public.decorator';

@ApiTags('system')
@Controller()
export class AppController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Health/root endpoint' })
  @ApiOkResponse({ example: { message: 'English Dictionary' } })
  root() {
    return { message: 'English Dictionary' };
  }
}
