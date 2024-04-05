import { ApiProperty } from '@nestjs/swagger';

export class DriverDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  givenName: string;

  @ApiProperty()
  familyName: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

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
