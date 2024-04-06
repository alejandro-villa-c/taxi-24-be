import { ApiProperty } from '@nestjs/swagger';

export class PassengerDto {
  @ApiProperty()
  public id: number;

  @ApiProperty()
  public givenName: string;

  @ApiProperty()
  public familyName: string;

  constructor(id: number, givenName: string, familyName: string) {
    this.id = id;
    this.givenName = givenName;
    this.familyName = familyName;
  }
}
