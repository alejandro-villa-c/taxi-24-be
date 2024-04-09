import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../../modules/app/app.module';
import * as request from 'supertest';
import { TripsMock } from '../mocks/trips/trips.mock';
import { TripDto } from '../../modules/trips/dtos/trip.dto';
import { EntityCreationHelpers } from '../helpers/entity-creation.helpers';

describe('TripsController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/trips (POST) - should create a new trip', async () => {
    const createdDriverDto = await EntityCreationHelpers.createDriver(app);
    const createdPassengerDto =
      await EntityCreationHelpers.createPassenger(app);

    const createTripDto =
      TripsMock.generateRandomCreateTripDtoWithSpecificDriverIdAndPassengerId(
        createdDriverDto.id,
        createdPassengerDto.id,
      );

    const response = await request(app.getHttpServer())
      .post('/trips')
      .send(createTripDto)
      .expect(HttpStatus.CREATED);

    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.driverId).toEqual(createTripDto.driverId);
    expect(response.body.data.passengerId).toEqual(createTripDto.passengerId);
    expect(response.body.data.startDate).toBeDefined();
    expect(response.body.data.endDate).toBeNull();
    expect(response.body.data.isActive).toEqual(true);
    expect(response.body.data.startLatitude).toEqual(
      Number(createTripDto.startLatitude),
    );
    expect(response.body.data.startLongitude).toEqual(
      Number(createTripDto.startLongitude),
    );
    expect(response.body.data.endLatitude).toEqual(
      Number(createTripDto.endLatitude),
    );
    expect(response.body.data.endLongitude).toEqual(
      Number(createTripDto.endLongitude),
    );
    expect(response.body.data.price).toEqual(Number(createTripDto.price));
    expect(response.body.data.priceCurrency).toEqual('DOP');
  });

  it('/trips/:id/complete (POST) - should complete a specific trip', async () => {
    const createdTrip: TripDto = await EntityCreationHelpers.createTrip(app);

    const response = await request(app.getHttpServer())
      .post(`/trips/${createdTrip.id}/complete`)
      .expect(HttpStatus.OK);

    expect(createdTrip.isActive).toEqual(true);
    expect(response.body.data.id).toEqual(createdTrip.id);
    expect(response.body.data.driverId).toEqual(createdTrip.driverId);
    expect(response.body.data.passengerId).toEqual(createdTrip.passengerId);
    expect(response.body.data.startDate).toBeDefined();
    expect(response.body.data.endDate).toBeDefined();
    expect(response.body.data.isActive).toEqual(false);
    expect(response.body.data.startLatitude).toEqual(
      Number(createdTrip.startLatitude),
    );
    expect(response.body.data.startLongitude).toEqual(
      Number(createdTrip.startLongitude),
    );
    expect(response.body.data.endLatitude).toEqual(
      Number(createdTrip.endLatitude),
    );
    expect(response.body.data.endLongitude).toEqual(
      Number(createdTrip.endLongitude),
    );
    expect(response.body.data.price).toEqual(Number(createdTrip.price));
    expect(response.body.data.priceCurrency).toEqual('DOP');
  });

  it('/trips/active (GET) - should return a list of active trips', async () => {
    const trip1: TripDto = await EntityCreationHelpers.createTrip(app);
    const trip2: TripDto = await EntityCreationHelpers.createTrip(app);

    const response = await request(app.getHttpServer())
      .get('/trips/active')
      .expect(HttpStatus.OK);

    expect(Array.isArray(response.body.data.records)).toBe(true);
    expect(response.body.data.records).toContainEqual(trip1);
    expect(response.body.data.records).toContainEqual(trip2);
  });

  it('/trips/completed/:id/bill (GET) - should return the bill for a specific completed trip', async () => {
    const createdTrip: TripDto = await EntityCreationHelpers.createTrip(app);

    const completedTrip = await request(app.getHttpServer())
      .post(`/trips/${createdTrip.id}/complete`)
      .expect(HttpStatus.OK);

    const response = await request(app.getHttpServer())
      .get(`/trips/completed/${completedTrip.body.data.id}/bill`)
      .expect(HttpStatus.OK);

    expect(response.header['content-type']).toBe('application/pdf');
    expect(response.header['content-disposition']).toMatch(
      /attachment; filename="taxi24-viaje-\d+-factura.pdf"/,
    );
    expect(response.body.length).toBeGreaterThan(0);
  });

  afterAll(async () => {
    await app.close();
  });
});
