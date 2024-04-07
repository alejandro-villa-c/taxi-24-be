import { faker } from '@faker-js/faker';
import { DriverDto } from '../../../modules/drivers/dtos/driver.dto';
import { CreateDriverDto } from '../../../modules/drivers/dtos/create-driver.dto';

export class DriversMock {
  public static generateRandomDriverDto(): DriverDto {
    return new DriverDto(
      faker.number.int(),
      faker.person.firstName(),
      faker.person.lastName(),
      faker.location.latitude(),
      faker.location.longitude(),
    );
  }

  public static generateRandomCreateDriverDto(): CreateDriverDto {
    const createDriverDto: CreateDriverDto = {
      givenName: faker.person.firstName(),
      familyName: faker.person.lastName(),
      latitude: String(faker.location.latitude()),
      longitude: String(faker.location.longitude()),
    };
    return createDriverDto;
  }

  public static generateRandomCreateDriverDtoWithSpecificCoordinates(
    latitude: number,
    longitude: number,
  ): CreateDriverDto {
    const createDriverDto: CreateDriverDto = {
      givenName: faker.person.firstName(),
      familyName: faker.person.lastName(),
      latitude: String(latitude),
      longitude: String(longitude),
    };
    return createDriverDto;
  }

  public static generateRandomDriverDtoWithSpecificId(id: number): DriverDto {
    return new DriverDto(
      id,
      faker.person.firstName(),
      faker.person.lastName(),
      faker.location.latitude(),
      faker.location.longitude(),
    );
  }
}
