import { Test, TestingModule } from '@nestjs/testing';
import { DriversController } from '../../modules/drivers/drivers.controller';
import { DriversService } from '../../modules/drivers/drivers.service';
import { CreateDriverDto } from '../../modules/drivers/dtos/create-driver.dto';
import { DriverDto } from '../../modules/drivers/dtos/driver.dto';
import { HttpResponse } from '../../shared/http-response';
import { DriversMock } from '../mocks/drivers/drivers.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Driver } from '../../modules/drivers/drivers.entity';
import { DriversRepositoryMock } from '../mocks/drivers/drivers-repository.mock';
import { faker } from '@faker-js/faker';
import { GisUtils } from '../../utils/gis.utils';

describe('DriversController', () => {
  let controller: DriversController;
  let service: DriversService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriversController],
      providers: [
        DriversService,
        {
          provide: getRepositoryToken(Driver),
          useClass: DriversRepositoryMock,
        },
      ],
    }).compile();

    controller = module.get<DriversController>(DriversController);
    service = module.get<DriversService>(DriversService);
  });

  describe('create', () => {
    it('should create a new driver', async () => {
      const randomDriverDto = DriversMock.generateRandomCreateDriverDto();
      const createDriverDto: CreateDriverDto = randomDriverDto;
      const driverDto: DriverDto = {
        ...randomDriverDto,
        latitude: Number(randomDriverDto.latitude),
        longitude: Number(randomDriverDto.longitude),
        id: faker.number.int(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(driverDto);

      const result = await controller.create(createDriverDto);

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(201);
      expect(result.data).toMatchObject(driverDto);
      expect(result.errorMessage).toBeUndefined();
    });

    it('should handle errors during driver creation', async () => {
      const createDriverDto: CreateDriverDto =
        DriversMock.generateRandomCreateDriverDto();

      const errorMessage = 'An error occurred';
      jest.spyOn(service, 'create').mockRejectedValue(new Error(errorMessage));

      const result = await controller.create(createDriverDto);

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(500);
      expect(result.data).toBeUndefined();
      expect(result.errorMessage).toEqual(errorMessage);
    });
  });

  describe('getAll', () => {
    it('should return all drivers', async () => {
      const mockDrivers: DriverDto[] = [DriversMock.generateRandomDriverDto()];

      jest.spyOn(service, 'findAll').mockResolvedValue({
        records: mockDrivers,
        totalRecords: mockDrivers.length,
      });

      const result = await controller.getAll();

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(200);
      expect(result.data).toEqual({
        records: mockDrivers,
        totalRecords: mockDrivers.length,
      });
      expect(result.errorMessage).toBeUndefined();
    });

    it('should handle errors during retrieval', async () => {
      const errorMessage = 'An unknown error occurred';
      jest.spyOn(service, 'findAll').mockRejectedValue(new Error(errorMessage));

      const result = await controller.getAll();

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(500);
      expect(result.data).toBeUndefined();
      expect(result.errorMessage).toEqual(errorMessage);
    });
  });

  describe('getById', () => {
    it('should return a driver by id', async () => {
      const driverId = faker.number.int();
      const mockDriver: DriverDto =
        DriversMock.generateRandomDriverDtoWithSpecificId(driverId);

      jest.spyOn(service, 'findById').mockResolvedValue(mockDriver);

      const result = await controller.getById(driverId);

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(200);
      expect(result.data).toEqual(mockDriver);
      expect(result.errorMessage).toBeUndefined();
    });

    it('should handle a not found driver', async () => {
      const driverId = faker.number.int();
      const errorMessage = 'Driver not found';
      jest.spyOn(service, 'findById').mockResolvedValue(undefined);

      const result = await controller.getById(driverId);

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(404);
      expect(result.data).toBeUndefined();
      expect(result.errorMessage).toEqual(errorMessage);
    });

    it('should handle errors during retrieval', async () => {
      const driverId = faker.number.int();
      const errorMessage = 'An unknown error occurred';
      jest
        .spyOn(service, 'findById')
        .mockRejectedValue(new Error(errorMessage));

      const result = await controller.getById(driverId);

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(500);
      expect(result.data).toBeUndefined();
      expect(result.errorMessage).toEqual(errorMessage);
    });
  });

  describe('getDriversWithinDistance', () => {
    it('should return drivers within a specified distance', async () => {
      const distanceInKm = 3;
      const latitude = 40.7128;
      const longitude = -74.006;
      const mockDrivers: DriverDto[] = [
        {
          id: 1,
          givenName: 'John',
          familyName: 'Doe',
          latitude: 40.7128,
          longitude: -74.006,
        },
      ];

      jest
        .spyOn(service, 'findDriversWithinDistance')
        .mockResolvedValue(mockDrivers);

      const result = await controller.getDriversWithinDistance(
        distanceInKm,
        latitude,
        longitude,
      );

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(200);
      expect(result.data).toEqual(mockDrivers);
      expect(result.errorMessage).toBeUndefined();
    });

    it('should return an empty array if no drivers are within the specified distance', async () => {
      const distanceInKm = 3;
      const latitude = 40.7128;
      const longitude = -74.006;
      const mockDriverFurther: DriverDto = {
        id: 1,
        givenName: 'John',
        familyName: 'Doe',
        latitude: 41.7128,
        longitude: -74.006,
      };
      const mockDrivers: DriverDto[] = [mockDriverFurther];

      jest
        .spyOn(service, 'findDriversWithinDistance')
        .mockImplementation(
          (distance: number, latitude: number, longitude: number) => {
            return Promise.resolve(
              mockDrivers.filter((mockDriver) => {
                const mockDriverDistance =
                  GisUtils.getDistanceBetweenCoordinatesInKm(
                    latitude,
                    longitude,
                    mockDriver.latitude,
                    mockDriver.longitude,
                  );
                return mockDriverDistance <= distance;
              }),
            );
          },
        );

      const result = await controller.getDriversWithinDistance(
        distanceInKm,
        latitude,
        longitude,
      );

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(200);
      expect(result.data).toEqual([]);
      expect(result.errorMessage).toBeUndefined();
    });

    it('should handle errors during retrieval', async () => {
      const distanceInKm = 3;
      const latitude = 40.7128;
      const longitude = -74.006;
      const errorMessage = 'An unknown error occurred';

      jest
        .spyOn(service, 'findDriversWithinDistance')
        .mockRejectedValue(new Error(errorMessage));

      const result = await controller.getDriversWithinDistance(
        distanceInKm,
        latitude,
        longitude,
      );

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(500);
      expect(result.data).toBeUndefined();
      expect(result.errorMessage).toEqual(errorMessage);
    });
  });
});
