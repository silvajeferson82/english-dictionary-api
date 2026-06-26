import { Body, Controller, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseAuthDto } from '../../application/dtos/auth/response-auth.dto';
import { SignInDto } from '../../application/dtos/auth/signin.dto';
import { SignUpDto } from '../../application/dtos/auth/signup.dto';
import { SignInUseCase } from '../../application/use-cases/auth/signin.use-case';
import { SignUpUseCase } from '../../application/use-cases/auth/signup.use-case';
import { Public } from '../../domain/decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
  ) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Create user account' })
  @ApiBody({ type: SignUpDto })
  @ApiOkResponse({
    description: 'User created',
    type: ResponseAuthDto,
    example: {
      id: 'f3a106sa65dv53ab2c1380acef',
      name: 'User 1',
      token: 'JWT.Token',
    },
  })
  @ApiBadRequestResponse({ example: { message: 'Error message' } })
  async signup(@Body() body: SignUpDto): Promise<ResponseAuthDto> {
    const result = await this.signUpUseCase.execute(body);

    return plainToInstance(ResponseAuthDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @Public()
  @Post('signin')
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({
    description: 'User authenticated',
    type: ResponseAuthDto,
    example: {
      id: 'f3a106sa65dv53ab2c1380acef',
      name: 'User 1',
      token: 'JWT.Token',
    },
  })
  @ApiBadRequestResponse({ example: { message: 'Error message' } })
  async signin(@Body() body: SignInDto): Promise<ResponseAuthDto> {
    const result = await this.signInUseCase.execute(body);

    return plainToInstance(ResponseAuthDto, result, {
      excludeExtraneousValues: true,
    });
  }
}
