import { faker } from '@faker-js/faker';
import { CreatePassengerDto } from '../../../modules/passengers/dtos/create-passenger.dto';
import { PassengerDto } from '../../../modules/passengers/dtos/passenger.dto';

export function generateRandomPassengerDto(): PassengerDto {
  return new PassengerDto(
    faker.number.int(),
    faker.person.firstName(),
    faker.person.lastName(),
  );
}

export function generateRandomCreatePassengerDto(): CreatePassengerDto {
  const createPassengerDto: CreatePassengerDto = {
    givenName: faker.person.firstName(),
    familyName: faker.person.lastName(),
  };
  return createPassengerDto;
}

export function generateRandomPassengerDtoWithSpecificId(
  id: number,
): PassengerDto {
  return new PassengerDto(
    id,
    faker.person.firstName(),
    faker.person.lastName(),
  );
}
