import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDecimal, IsString } from 'class-validator';

export class CreateDriverDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  givenName!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  familyName!: string;

  @IsNotEmpty()
  @IsDecimal()
  @ApiProperty()
  latitude!: string;

  @IsNotEmpty()
  @IsDecimal()
  @ApiProperty()
  longitude!: string;
}
