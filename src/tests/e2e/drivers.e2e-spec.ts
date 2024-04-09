import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../../modules/app/app.module';
import * as request from 'supertest';
import { DriversMock } from '../mocks/drivers/drivers.mock';
import { DriverDto } from '../../modules/drivers/dtos/driver.dto';
import { EntityCreationHelpers } from '../helpers/entity-creation.helpers';
import { GisUtils } from '../../utils/gis.utils';
import { EntityRemovalHelpers } from '../helpers/entity-removal.helpers';
import { Driver } from '../../modules/drivers/drivers.entity';
import { Trip } from '../../modules/trips/trips.entity';
import { Passenger } from '../../modules/passengers/passengers.entity';

describe('DriversController (E2E)', () => {
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

  it('/drivers (POST) - should create a new driver', async () => {
    const createDriverDto = DriversMock.generateRandomCreateDriverDto();

    const response = await request(app.getHttpServer())
      .post('/drivers')
      .send(createDriverDto)
      .expect(HttpStatus.CREATED);

    await entityRemovalHelpers.removeEntity(Driver, response.body.data.id);

    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.givenName).toEqual(createDriverDto.givenName);
    expect(response.body.data.familyName).toEqual(createDriverDto.familyName);
    expect(response.body.data.latitude).toEqual(
      Number(createDriverDto.latitude),
    );
    expect(response.body.data.longitude).toEqual(
      Number(createDriverDto.longitude),
    );
  });

  it('/drivers/:id (GET) - should return a specific driver', async () => {
    const createdDriver: DriverDto =
      await EntityCreationHelpers.createDriver(app);

    const response = await request(app.getHttpServer())
      .get(`/drivers/${createdDriver.id}`)
      .expect(HttpStatus.OK);

    await entityRemovalHelpers.removeEntity(Driver, createdDriver.id);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toEqual(createdDriver.id);
    expect(response.body.data.givenName).toEqual(createdDriver.givenName);
    expect(response.body.data.familyName).toEqual(createdDriver.familyName);
  });

  it('/drivers (GET) - should return a list of drivers', async () => {
    const driver1: DriverDto = await EntityCreationHelpers.createDriver(app);
    const driver2: DriverDto = await EntityCreationHelpers.createDriver(app);

    const response = await request(app.getHttpServer())
      .get('/drivers')
      .expect(HttpStatus.OK);

    await entityRemovalHelpers.removeEntity(Driver, driver1.id);
    await entityRemovalHelpers.removeEntity(Driver, driver2.id);

    expect(Array.isArray(response.body.data.records)).toBe(true);
    expect(response.body.data.records).toContainEqual(driver1);
    expect(response.body.data.records).toContainEqual(driver2);
  });

  it('/drivers/search (GET) - should return available drivers within the specified distance from a location', async () => {
    const distance = 3;
    const latitudeWithin = 1.23;
    const longitudeWithin = 4.56;
    const latitudeOutside = 10.0;
    const longitudeOutside = 20.0;

    const driverWithinAndAvailable =
      await EntityCreationHelpers.createDriverWithSpecificCoordinates(
        app,
        latitudeWithin,
        longitudeWithin,
      );

    const driverWithinAndNotAvailable =
      await EntityCreationHelpers.createDriverWithSpecificCoordinates(
        app,
        latitudeWithin,
        longitudeWithin,
      );
    const createdPassenger = await EntityCreationHelpers.createPassenger(app);
    const driverNotAvailableTrip = await EntityCreationHelpers.createTrip(
      app,
      driverWithinAndNotAvailable.id,
      createdPassenger.id,
    );

    const driverOutside =
      await EntityCreationHelpers.createDriverWithSpecificCoordinates(
        app,
        latitudeOutside,
        longitudeOutside,
      );

    const response = await request(app.getHttpServer())
      .get(`/drivers/search`)
      .query({
        latitude: latitudeWithin,
        longitude: longitudeWithin,
        distance,
        getAvailableDrivers: true,
      })
      .expect(HttpStatus.OK);

    await entityRemovalHelpers.removeEntity(
      Driver,
      driverWithinAndAvailable.id,
    );
    await entityRemovalHelpers.removeEntity(Trip, driverNotAvailableTrip.id);
    await entityRemovalHelpers.removeEntity(Passenger, createdPassenger.id);
    await entityRemovalHelpers.removeEntity(
      Driver,
      driverWithinAndNotAvailable.id,
    );
    await entityRemovalHelpers.removeEntity(Driver, driverOutside.id);

    expect(Array.isArray(response.body.data.records)).toBe(true);
    expect(
      response.body.data.records.some(
        (driver: DriverDto) => driver.id === driverWithinAndAvailable.id,
      ),
    ).toBe(true);
    expect(
      response.body.data.records.some(
        (driver: DriverDto) => driver.id === driverWithinAndNotAvailable.id,
      ),
    ).toBe(false);
    expect(
      response.body.data.records.some(
        (driver: DriverDto) => driver.id === driverOutside.id,
      ),
    ).toBe(false);
  });

  it('/drivers/search (GET) - should return the nearest drivers from a location', async () => {
    const latitude = 0;
    const longitude = 0;

    const driver1: DriverDto = await EntityCreationHelpers.createDriver(app);
    const driver2: DriverDto = await EntityCreationHelpers.createDriver(app);
    const driver3: DriverDto = await EntityCreationHelpers.createDriver(app);
    const driver4: DriverDto = await EntityCreationHelpers.createDriver(app);

    const driversWithDistance = [
      {
        driver: driver1,
        distance: GisUtils.getDistanceBetweenCoordinatesInKm(
          latitude,
          longitude,
          driver1.latitude,
          driver1.longitude,
        ),
      },
      {
        driver: driver2,
        distance: GisUtils.getDistanceBetweenCoordinatesInKm(
          latitude,
          longitude,
          driver2.latitude,
          driver2.longitude,
        ),
      },
      {
        driver: driver3,
        distance: GisUtils.getDistanceBetweenCoordinatesInKm(
          latitude,
          longitude,
          driver3.latitude,
          driver3.longitude,
        ),
      },
      {
        driver: driver4,
        distance: GisUtils.getDistanceBetweenCoordinatesInKm(
          latitude,
          longitude,
          driver4.latitude,
          driver4.longitude,
        ),
      },
    ];

    driversWithDistance.sort((a, b) => a.distance - b.distance);

    const expectedDrivers = driversWithDistance.map((item) => item.driver);

    const response = await request(app.getHttpServer())
      .get(`/drivers/search`)
      .query({ latitude, longitude })
      .expect(HttpStatus.OK);

    const filteredResponseDrivers = response.body.data.records.filter(
      (record: DriverDto) => {
        return [driver1.id, driver2.id, driver3.id, driver4.id].includes(
          record.id,
        );
      },
    );

    await entityRemovalHelpers.removeEntity(Driver, driver1.id);
    await entityRemovalHelpers.removeEntity(Driver, driver2.id);
    await entityRemovalHelpers.removeEntity(Driver, driver3.id);
    await entityRemovalHelpers.removeEntity(Driver, driver4.id);

    expect(Array.isArray(response.body.data.records)).toBe(true);
    expect(filteredResponseDrivers).toEqual(expectedDrivers);
  });

  afterAll(async () => {
    await app.close();
  });
});
