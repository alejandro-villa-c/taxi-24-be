import { faker } from '@faker-js/faker';
import { TripDto } from '../../../modules/trips/dtos/trip.dto';
import { CreateTripDto } from '../../../modules/trips/dtos/create-trip.dto';

export class TripsMock {
  public static generateRandomTripDto(): TripDto {
    return new TripDto(
      faker.number.int(),
      faker.number.int(),
      faker.person.firstName(),
      faker.number.int(),
      faker.person.lastName(),
      faker.date.anytime(),
      undefined,
      true,
      faker.location.latitude(),
      faker.location.longitude(),
      faker.location.latitude(),
      faker.location.longitude(),
      Number(faker.finance.amount()),
      'DOP',
    );
  }

  public static generateRandomCompletedTripDtoWithSpecificId(
    tripId: number,
  ): TripDto {
    return new TripDto(
      tripId,
      faker.number.int(),
      faker.person.firstName(),
      faker.number.int(),
      faker.person.lastName(),
      faker.date.anytime(),
      faker.date.anytime(),
      false,
      faker.location.latitude(),
      faker.location.longitude(),
      faker.location.latitude(),
      faker.location.longitude(),
      Number(faker.finance.amount()),
      'DOP',
    );
  }

  public static generateRandomCreateTripDto(): CreateTripDto {
    const createTripDto: CreateTripDto = {
      driverId: faker.number.int(),
      passengerId: faker.number.int(),
      startLatitude: String(faker.location.latitude()),
      startLongitude: String(faker.location.longitude()),
      endLatitude: String(faker.location.latitude()),
      endLongitude: String(faker.location.longitude()),
      price: faker.finance.amount(),
    };
    return createTripDto;
  }

  public static generateRandomCreateTripDtoWithSpecificDriverIdAndPassengerId(
    driverId: number,
    passengerId: number,
  ): CreateTripDto {
    const createTripDto: CreateTripDto = {
      driverId,
      passengerId,
      startLatitude: String(faker.location.latitude()),
      startLongitude: String(faker.location.longitude()),
      endLatitude: String(faker.location.latitude()),
      endLongitude: String(faker.location.longitude()),
      price: faker.finance.amount(),
    };
    return createTripDto;
  }
}
