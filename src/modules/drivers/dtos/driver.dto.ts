import { ApiProperty } from '@nestjs/swagger';

export class DriverDto {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  public givenName: string;

  @ApiProperty()
  public familyName: string;

  @ApiProperty()
  public latitude: number;

  @ApiProperty()
  public longitude: number;

  constructor(
    id: number,
    givenName: string,
    familyName: string,
    latitude: number,
    longitude: number,
  ) {
    this.id = id;
    this.givenName = givenName;
    this.familyName = familyName;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
