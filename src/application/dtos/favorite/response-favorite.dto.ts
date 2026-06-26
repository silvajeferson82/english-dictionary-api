import { ApiProperty } from '@nestjs/swagger';

export class ResponseFavoriteDto {
  @ApiProperty({ example: 'fire' })
  word!: string;
  @ApiProperty({ example: '2024-05-05T19:30:23.928Z' })
  added!: Date;
}
