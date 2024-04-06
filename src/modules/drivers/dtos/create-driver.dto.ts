import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDecimal, IsString } from 'class-validator';

export class CreateDriverDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public givenName!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public familyName!: string;

  @IsNotEmpty()
  @IsDecimal()
  @ApiProperty()
  public latitude!: string;

  @IsNotEmpty()
  @IsDecimal()
  @ApiProperty()
  public longitude!: string;
}
