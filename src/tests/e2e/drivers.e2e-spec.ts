import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../../modules/app/app.module';
import * as request from 'supertest';
import { DriversMock } from '../mocks/drivers/drivers.mock';
import { DriverDto } from '../../modules/drivers/dtos/driver.dto';
import { EntityCreationHelpers } from '../helpers/entity-creation.helpers';

describe('DriversController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/drivers (POST) - should create a new driver', async () => {
    const createDriverDto = DriversMock.generateRandomCreateDriverDto();

    const response = await request(app.getHttpServer())
      .post('/drivers')
      .send(createDriverDto)
      .expect(HttpStatus.CREATED);

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

    expect(Array.isArray(response.body.data.records)).toBe(true);
    expect(response.body.data.records).toContainEqual(driver1);
    expect(response.body.data.records).toContainEqual(driver2);
  });

  it('/drivers/within/:distance/km (GET) - should return drivers within the specified distance', async () => {
    const distance = 3;
    const latitudeWithin = 1.23;
    const longitudeWithin = 4.56;
    const latitudeOutside = 10.0;
    const longitudeOutside = 20.0;

    const driverWithin =
      await EntityCreationHelpers.createDriverWithSpecificCoordinates(
        app,
        latitudeWithin,
        longitudeWithin,
      );
    const driverOutside =
      await EntityCreationHelpers.createDriverWithSpecificCoordinates(
        app,
        latitudeOutside,
        longitudeOutside,
      );

    const response = await request(app.getHttpServer())
      .get(`/drivers/within/${distance}/km`)
      .query({ latitude: latitudeWithin, longitude: longitudeWithin })
      .expect(HttpStatus.OK);

    expect(Array.isArray(response.body.data)).toBe(true);
    expect(
      response.body.data.some(
        (driver: DriverDto) => driver.id === driverWithin.id,
      ),
    ).toBe(true);
    expect(
      response.body.data.some(
        (driver: DriverDto) => driver.id === driverOutside.id,
      ),
    ).toBe(false);
  });

  afterAll(async () => {
    await app.close();
  });
});
