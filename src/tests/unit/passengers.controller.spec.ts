import { Test, TestingModule } from '@nestjs/testing';
import { PassengersController } from '../../modules/passengers/passengers.controller';
import { PassengersService } from '../../modules/passengers/passengers.service';
import { HttpResponse } from '../../shared/http-response';
import { PassengerDto } from '../../modules/passengers/dtos/passenger.dto';
import { CreatePassengerDto } from '../../modules/passengers/dtos/create-passenger.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Passenger } from '../../modules/passengers/passengers.entity';
import { PassengersRepositoryMock } from '../mocks/passengers/passengers-repository.mock';
import { faker } from '@faker-js/faker';
import { PassengersMock } from '../mocks/passengers/passengers.mock';
import { HttpStatus } from '@nestjs/common';

describe('PassengersController', () => {
  let controller: PassengersController;
  let service: PassengersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PassengersController],
      providers: [
        PassengersService,
        {
          provide: getRepositoryToken(Passenger),
          useClass: PassengersRepositoryMock,
        },
      ],
    }).compile();

    controller = module.get<PassengersController>(PassengersController);
    service = module.get<PassengersService>(PassengersService);
  });

  describe('create', () => {
    it('should create a new passenger', async () => {
      const randomPassengerDto =
        PassengersMock.generateRandomCreatePassengerDto();
      const createPassengerDto: CreatePassengerDto = randomPassengerDto;
      const passengerDto: PassengerDto = {
        ...randomPassengerDto,
        id: faker.number.int(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(passengerDto);

      const result = await controller.create(createPassengerDto);

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(HttpStatus.CREATED);
      expect(result.data).toMatchObject(passengerDto);
      expect(result.errorMessage).toBeUndefined();
    });

    it('should handle errors during passenger creation', async () => {
      const createPassengerDto: CreatePassengerDto =
        PassengersMock.generateRandomCreatePassengerDto();

      const errorMessage = 'An unknown error occurred';
      jest.spyOn(service, 'create').mockRejectedValue(new Error(errorMessage));

      const result = await controller.create(createPassengerDto);

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.data).toBeUndefined();
      expect(result.errorMessage).toEqual(errorMessage);
    });
  });

  describe('getAll', () => {
    it('should return all passengers', async () => {
      const mockPassengers: PassengerDto[] = [
        PassengersMock.generateRandomPassengerDto(),
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue({
        records: mockPassengers,
        totalRecords: mockPassengers.length,
      });

      const result = await controller.getAll();

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.data).toEqual({
        records: mockPassengers,
        totalRecords: mockPassengers.length,
      });
      expect(result.errorMessage).toBeUndefined();
    });

    it('should handle errors during retrieval', async () => {
      const errorMessage = 'An unknown error occurred';
      jest.spyOn(service, 'findAll').mockRejectedValue(new Error(errorMessage));

      const result = await controller.getAll();

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.data).toBeUndefined();
      expect(result.errorMessage).toEqual(errorMessage);
    });
  });

  describe('getById', () => {
    it('should return a passenger by id', async () => {
      const passengerId = faker.number.int();
      const mockPassenger: PassengerDto =
        PassengersMock.generateRandomPassengerDtoWithSpecificId(passengerId);

      jest.spyOn(service, 'findById').mockResolvedValue(mockPassenger);

      const result = await controller.getById(passengerId);

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.data).toEqual(mockPassenger);
      expect(result.errorMessage).toBeUndefined();
    });

    it('should handle a not found passenger', async () => {
      const passengerId = faker.number.int();
      const errorMessage = 'Passenger not found';
      jest.spyOn(service, 'findById').mockResolvedValue(undefined);

      const result = await controller.getById(passengerId);

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(HttpStatus.NOT_FOUND);
      expect(result.data).toBeUndefined();
      expect(result.errorMessage).toEqual(errorMessage);
    });

    it('should handle errors during retrieval', async () => {
      const passengerId = faker.number.int();
      const errorMessage = 'An unknown error occurred';
      jest
        .spyOn(service, 'findById')
        .mockRejectedValue(new Error(errorMessage));

      const result = await controller.getById(passengerId);

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.data).toBeUndefined();
      expect(result.errorMessage).toEqual(errorMessage);
    });
  });
});
