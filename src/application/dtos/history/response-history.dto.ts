import { ApiProperty } from '@nestjs/swagger';

export class ResponseHistoryDto {
  @ApiProperty({ example: 'fire' })
  word!: string;
  @ApiProperty({ example: '2024-05-05T19:28:13.531Z' })
  added!: Date;
}
