import { faker } from '@faker-js/faker';
import { DriverDto } from '../../../modules/drivers/dtos/driver.dto';
import { CreateDriverDto } from '../../../modules/drivers/dtos/create-driver.dto';

export function generateRandomDriverDto(): DriverDto {
  return new DriverDto(
    faker.number.int(),
    faker.person.firstName(),
    faker.person.lastName(),
    faker.location.latitude(),
    faker.location.longitude(),
  );
}

export function generateRandomCreateDriverDto(): CreateDriverDto {
  const createDriverDto: CreateDriverDto = {
    givenName: faker.person.firstName(),
    familyName: faker.person.lastName(),
    latitude: String(faker.location.latitude()),
    longitude: String(faker.location.longitude()),
  };
  return createDriverDto;
}

export function generateCreateDriverDtoWithSpecificCoordinates(
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
