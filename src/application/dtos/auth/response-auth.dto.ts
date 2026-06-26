import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseAuthDto {
  @ApiProperty({ example: 'f3a106sa65dv53ab2c1380acef' })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'User 1' })
  @Expose()
  name!: string;

  @ApiProperty({ example: 'JWT.Token' })
  @Expose()
  token!: string;
}
