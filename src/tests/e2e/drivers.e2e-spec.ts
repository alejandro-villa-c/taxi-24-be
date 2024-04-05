import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../modules/app/app.module';
import * as request from 'supertest';
import {
  generateCreateDriverDtoWithSpecificCoordinates,
  generateRandomCreateDriverDto,
} from '../mocks/drivers/drivers.mock';
import { DriverDto } from '../../modules/drivers/dtos/driver.dto';
import { CreateDriverDto } from '../../modules/drivers/dtos/create-driver.dto';

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
    const createDriverDto = generateRandomCreateDriverDto();

    const response = await request(app.getHttpServer())
      .post('/drivers')
      .send(createDriverDto)
      .expect(201);

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

  it('/drivers/within/:distance/km (GET) - should return drivers within the specified distance', async () => {
    const distance = 3;
    const latitudeWithin = 1.23;
    const longitudeWithin = 4.56;
    const latitudeOutside = 10.0;
    const longitudeOutside = 20.0;

    const driverWithin = await createDriver(
      app,
      latitudeWithin,
      longitudeWithin,
    );
    const driverOutside = await createDriver(
      app,
      latitudeOutside,
      longitudeOutside,
    );

    const response = await request(app.getHttpServer())
      .get(`/drivers/within/${distance}/km`)
      .query({ latitude: latitudeWithin, longitude: longitudeWithin })
      .expect(200);

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

async function createDriver(
  app: INestApplication,
  latitude: number,
  longitude: number,
): Promise<DriverDto> {
  const createDriverDto: CreateDriverDto =
    generateCreateDriverDtoWithSpecificCoordinates(latitude, longitude);

  const response = await request(app.getHttpServer())
    .post('/drivers')
    .send(createDriverDto)
    .expect(201);

  return response.body.data;
}
