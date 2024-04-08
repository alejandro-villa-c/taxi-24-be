import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDecimal, IsInt } from 'class-validator';

export class CreateTripDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  public driverId!: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  public passengerId!: number;

  @IsNotEmpty()
  @IsDecimal()
  @ApiProperty()
  public startLatitude!: string;

  @IsNotEmpty()
  @IsDecimal()
  @ApiProperty()
  public startLongitude!: string;

  @IsNotEmpty()
  @IsDecimal()
  @ApiProperty()
  public endLatitude!: string;

  @IsNotEmpty()
  @IsDecimal()
  @ApiProperty()
  public endLongitude!: string;

  @IsNotEmpty()
  @IsDecimal()
  @ApiProperty()
  public price!: string;
}
