import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../../modules/app/app.module';
import * as request from 'supertest';
import { PassengersMock } from '../mocks/passengers/passengers.mock';
import { PassengerDto } from '../../modules/passengers/dtos/passenger.dto';
import { EntityCreationHelpers } from '../helpers/entity-creation.helpers';

describe('PassengersController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/passengers (POST) - should create a new passenger', async () => {
    const createPassengerDto =
      PassengersMock.generateRandomCreatePassengerDto();

    const response = await request(app.getHttpServer())
      .post('/passengers')
      .send(createPassengerDto)
      .expect(HttpStatus.CREATED);

    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.givenName).toEqual(createPassengerDto.givenName);
    expect(response.body.data.familyName).toEqual(
      createPassengerDto.familyName,
    );
  });

  it('/passengers/:id (GET) - should return a specific passenger', async () => {
    const createdPassenger: PassengerDto =
      await EntityCreationHelpers.createPassenger(app);

    const response = await request(app.getHttpServer())
      .get(`/passengers/${createdPassenger.id}`)
      .expect(HttpStatus.OK);

    expect(response.body.data).toBeDefined();
    expect(response.body.data.id).toEqual(createdPassenger.id);
    expect(response.body.data.givenName).toEqual(createdPassenger.givenName);
    expect(response.body.data.familyName).toEqual(createdPassenger.familyName);
  });

  it('/passengers (GET) - should return a list of passengers', async () => {
    const passenger1: PassengerDto =
      await EntityCreationHelpers.createPassenger(app);
    const passenger2: PassengerDto =
      await EntityCreationHelpers.createPassenger(app);

    const response = await request(app.getHttpServer())
      .get('/passengers')
      .expect(HttpStatus.OK);

    expect(Array.isArray(response.body.data.records)).toBe(true);
    expect(response.body.data.records).toContainEqual(passenger1);
    expect(response.body.data.records).toContainEqual(passenger2);
  });

  afterAll(async () => {
    await app.close();
  });
});
