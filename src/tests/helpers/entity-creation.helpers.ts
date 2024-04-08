import { HttpStatus, INestApplication } from '@nestjs/common';
import { CreateTripDto } from '../../modules/trips/dtos/create-trip.dto';
import { TripDto } from '../../modules/trips/dtos/trip.dto';
import { TripsMock } from '../mocks/trips/trips.mock';
import * as request from 'supertest';
import { PassengerDto } from '../../modules/passengers/dtos/passenger.dto';
import { CreatePassengerDto } from '../../modules/passengers/dtos/create-passenger.dto';
import { PassengersMock } from '../mocks/passengers/passengers.mock';
import { DriverDto } from '../../modules/drivers/dtos/driver.dto';
import { CreateDriverDto } from '../../modules/drivers/dtos/create-driver.dto';
import { DriversMock } from '../mocks/drivers/drivers.mock';

export class EntityCreationHelpers {
  public static async createTrip(app: INestApplication): Promise<TripDto> {
    const createdDriverDto = await EntityCreationHelpers.createDriver(app);
    const createdPassengerDto =
      await EntityCreationHelpers.createPassenger(app);

    const createTripDto: CreateTripDto =
      TripsMock.generateRandomCreateTripDtoWithSpecificDriverIdAndPassengerId(
        createdDriverDto.id,
        createdPassengerDto.id,
      );

    const response = await request(app.getHttpServer())
      .post('/trips')
      .send(createTripDto)
      .expect(HttpStatus.CREATED);

    return response.body.data;
  }

  public static async createPassenger(
    app: INestApplication,
  ): Promise<PassengerDto> {
    const createPassengerDto: CreatePassengerDto =
      PassengersMock.generateRandomCreatePassengerDto();

    const response = await request(app.getHttpServer())
      .post('/passengers')
      .send(createPassengerDto)
      .expect(HttpStatus.CREATED);

    return response.body.data;
  }

  public static async createDriver(app: INestApplication): Promise<DriverDto> {
    const createDriverDto: CreateDriverDto =
      DriversMock.generateRandomCreateDriverDto();

    const response = await request(app.getHttpServer())
      .post('/drivers')
      .send(createDriverDto)
      .expect(HttpStatus.CREATED);

    return response.body.data;
  }

  public static async createDriverWithSpecificCoordinates(
    app: INestApplication,
    latitude: number,
    longitude: number,
  ): Promise<DriverDto> {
    const createDriverDto: CreateDriverDto =
      DriversMock.generateRandomCreateDriverDtoWithSpecificCoordinates(
        latitude,
        longitude,
      );

    const response = await request(app.getHttpServer())
      .post('/drivers')
      .send(createDriverDto)
      .expect(HttpStatus.CREATED);

    return response.body.data;
  }
}
