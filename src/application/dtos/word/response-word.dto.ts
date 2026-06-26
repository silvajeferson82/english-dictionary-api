import { ApiProperty } from '@nestjs/swagger';

export class ResponseWordDto {
  @ApiProperty({ example: 'fire' })
  word!: string;
}
