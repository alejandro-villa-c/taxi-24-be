import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../../modules/app/app.module';
import * as request from 'supertest';
import { TripsMock } from '../mocks/trips/trips.mock';
import { TripDto } from '../../modules/trips/dtos/trip.dto';
import { EntityCreationHelpers } from '../helpers/entity-creation.helpers';
import { EntityRemovalHelpers } from '../helpers/entity-removal.helpers';
import { Trip } from '../../modules/trips/trips.entity';
import { Driver } from '../../modules/drivers/drivers.entity';
import { Passenger } from '../../modules/passengers/passengers.entity';

describe('TripsController (E2E)', () => {
  let app: INestApplication;
  let entityRemovalHelpers: EntityRemovalHelpers;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    entityRemovalHelpers = new EntityRemovalHelpers(moduleFixture);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/trips (POST) - should create a new trip', async () => {
    const createdDriver = await EntityCreationHelpers.createDriver(app);
    const createdPassenger = await EntityCreationHelpers.createPassenger(app);

    const createTripDto =
      TripsMock.generateRandomCreateTripDtoWithSpecificDriverIdAndPassengerId(
        createdDriver.id,
        createdPassenger.id,
      );

    const response = await request(app.getHttpServer())
      .post('/trips')
      .send(createTripDto)
      .expect(HttpStatus.CREATED);

    await entityRemovalHelpers.removeEntity(Trip, response.body.data.id);
    await entityRemovalHelpers.removeEntity(Driver, createdDriver.id);
    await entityRemovalHelpers.removeEntity(Passenger, createdPassenger.id);

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
    const createdDriver = await EntityCreationHelpers.createDriver(app);
    const createdPassenger = await EntityCreationHelpers.createPassenger(app);
    const createdTrip: TripDto = await EntityCreationHelpers.createTrip(
      app,
      createdDriver.id,
      createdPassenger.id,
    );

    const response = await request(app.getHttpServer())
      .post(`/trips/${createdTrip.id}/complete`)
      .expect(HttpStatus.OK);

    await entityRemovalHelpers.removeEntity(Trip, createdTrip.id);
    await entityRemovalHelpers.removeEntity(Driver, createdDriver.id);
    await entityRemovalHelpers.removeEntity(Passenger, createdPassenger.id);

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
    const createdDriver1 = await EntityCreationHelpers.createDriver(app);
    const createdPassenger1 = await EntityCreationHelpers.createPassenger(app);
    const trip1: TripDto = await EntityCreationHelpers.createTrip(
      app,
      createdDriver1.id,
      createdPassenger1.id,
    );
    const createdDriver2 = await EntityCreationHelpers.createDriver(app);
    const createdPassenger2 = await EntityCreationHelpers.createPassenger(app);
    const trip2: TripDto = await EntityCreationHelpers.createTrip(
      app,
      createdDriver2.id,
      createdPassenger2.id,
    );

    const response = await request(app.getHttpServer())
      .get('/trips/active')
      .expect(HttpStatus.OK);

    await entityRemovalHelpers.removeEntity(Trip, trip1.id);
    await entityRemovalHelpers.removeEntity(Driver, createdDriver1.id);
    await entityRemovalHelpers.removeEntity(Passenger, createdPassenger1.id);
    await entityRemovalHelpers.removeEntity(Trip, trip2.id);
    await entityRemovalHelpers.removeEntity(Driver, createdDriver2.id);
    await entityRemovalHelpers.removeEntity(Passenger, createdPassenger2.id);

    expect(Array.isArray(response.body.data.records)).toBe(true);
    expect(response.body.data.records).toContainEqual(trip1);
    expect(response.body.data.records).toContainEqual(trip2);
  });

  it('/trips/completed/:id/bill (GET) - should return the bill for a specific completed trip', async () => {
    const createdDriver = await EntityCreationHelpers.createDriver(app);
    const createdPassenger = await EntityCreationHelpers.createPassenger(app);
    const createdTrip: TripDto = await EntityCreationHelpers.createTrip(
      app,
      createdDriver.id,
      createdPassenger.id,
    );

    const completedTrip = await request(app.getHttpServer())
      .post(`/trips/${createdTrip.id}/complete`)
      .expect(HttpStatus.OK);

    const response = await request(app.getHttpServer())
      .get(`/trips/completed/${completedTrip.body.data.id}/bill`)
      .expect(HttpStatus.OK);

    await entityRemovalHelpers.removeEntity(Trip, createdTrip.id);
    await entityRemovalHelpers.removeEntity(Driver, createdDriver.id);
    await entityRemovalHelpers.removeEntity(Passenger, createdPassenger.id);

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
