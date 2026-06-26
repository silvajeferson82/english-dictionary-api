import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'example@email.com' })
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: 'test1234' })
  @IsString()
  @MinLength(4)
  @MaxLength(128)
  password!: string;
}
