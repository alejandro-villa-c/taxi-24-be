import { ApiProperty } from '@nestjs/swagger';

export class TripDto {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  public driverId: number;

  @ApiProperty()
  public passengerId: number;

  @ApiProperty()
  public startDate: Date;

  @ApiProperty({ nullable: true })
  public endDate?: Date;

  @ApiProperty()
  public isActive: boolean;

  @ApiProperty()
  public startLatitude: number;

  @ApiProperty()
  public startLongitude: number;

  @ApiProperty()
  public endLatitude: number;

  @ApiProperty()
  public endLongitude: number;

  @ApiProperty()
  public price: number;

  @ApiProperty()
  public priceCurrency: string;

  constructor(
    id: number,
    driverId: number,
    passengerId: number,
    startDate: Date,
    endDate: Date | undefined,
    isActive: boolean,
    startLatitude: number,
    startLongitude: number,
    endLatitude: number,
    endLongitude: number,
    price: number,
    priceCurrency: string,
  ) {
    this.id = id;
    this.driverId = driverId;
    this.passengerId = passengerId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.isActive = isActive;
    this.startLatitude = startLatitude;
    this.startLongitude = startLongitude;
    this.endLatitude = endLatitude;
    this.endLongitude = endLongitude;
    this.price = price;
    this.priceCurrency = priceCurrency;
  }
}
