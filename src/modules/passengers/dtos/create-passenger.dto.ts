import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePassengerDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public givenName!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  public familyName!: string;
}
