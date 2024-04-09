import { Test, TestingModule } from '@nestjs/testing';
import { TripsController } from '../../modules/trips/trips.controller';
import { TripsService } from '../../modules/trips/trips.service';
import { CreateTripDto } from '../../modules/trips/dtos/create-trip.dto';
import { TripDto } from '../../modules/trips/dtos/trip.dto';
import { HttpResponse } from '../../shared/http-response';
import { HttpStatus } from '@nestjs/common';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { TripsMock } from '../mocks/trips/trips.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Trip } from '../../modules/trips/trips.entity';
import { TripsRepositoryMock } from '../mocks/trips/trips-repository.mock';
import { faker } from '@faker-js/faker';
import { Response } from 'express';

describe('TripsController', () => {
  let controller: TripsController;
  let service: TripsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripsController],
      providers: [
        TripsService,
        {
          provide: getRepositoryToken(Trip),
          useClass: TripsRepositoryMock,
        },
      ],
    }).compile();

    controller = module.get<TripsController>(TripsController);
    service = module.get<TripsService>(TripsService);
  });

  describe('create', () => {
    it('should create a new trip', async () => {
      const randomTripDto = TripsMock.generateRandomCreateTripDto();
      const createTripDto: CreateTripDto = randomTripDto;
      const tripDto: TripDto = {
        ...randomTripDto,
        startDate: new Date(),
        isActive: true,
        startLatitude: Number(randomTripDto.startLatitude),
        startLongitude: Number(randomTripDto.startLongitude),
        endLatitude: Number(randomTripDto.endLatitude),
        endLongitude: Number(randomTripDto.endLongitude),
        price: Number(randomTripDto.price),
        priceCurrency: 'DOP',
        id: faker.number.int(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(tripDto);

      const result = await controller.create(createTripDto);

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(HttpStatus.CREATED);
      expect(result.data).toMatchObject(tripDto);
      expect(result.errorMessage).toBeUndefined();
    });

    it('should handle conflict exception during trip creation', async () => {
      const createTripDto: CreateTripDto =
        TripsMock.generateRandomCreateTripDto();

      const errorMessage = 'Driver or passenger already has an active trip';
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new ConflictException(errorMessage));

      const result = await controller.create(createTripDto);

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(HttpStatus.CONFLICT);
      expect(result.data).toBeUndefined();
      expect(result.errorMessage).toEqual(errorMessage);
    });

    it('should handle errors during trip creation', async () => {
      const createTripDto: CreateTripDto =
        TripsMock.generateRandomCreateTripDto();

      const errorMessage = 'An unknown error occurred';
      jest.spyOn(service, 'create').mockRejectedValue(new Error(errorMessage));

      const result = await controller.create(createTripDto);

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.data).toBeUndefined();
      expect(result.errorMessage).toEqual(errorMessage);
    });
  });

  describe('completeTrip', () => {
    it('should complete a trip', async () => {
      const tripId = faker.number.int();
      const randomTripDto = TripsMock.generateRandomCreateTripDto();
      const tripDto: TripDto = {
        ...randomTripDto,
        startDate: new Date(),
        isActive: false,
        startLatitude: Number(randomTripDto.startLatitude),
        startLongitude: Number(randomTripDto.startLongitude),
        endLatitude: Number(randomTripDto.endLatitude),
        endLongitude: Number(randomTripDto.endLongitude),
        price: Number(randomTripDto.price),
        priceCurrency: 'DOP',
        id: tripId,
      };

      jest.spyOn(service, 'completeTrip').mockResolvedValue(tripDto);

      const result = await controller.completeTrip(tripId);

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.data).toMatchObject(tripDto);
      expect(result.errorMessage).toBeUndefined();
    });

    it('should handle not found exception during trip completion', async () => {
      const tripId = faker.number.int();
      const errorMessage = 'Trip not found';
      jest
        .spyOn(service, 'completeTrip')
        .mockRejectedValue(new NotFoundException(errorMessage));

      const result = await controller.completeTrip(tripId);

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(HttpStatus.NOT_FOUND);
      expect(result.data).toBeUndefined();
      expect(result.errorMessage).toEqual(errorMessage);
    });

    it('should handle errors during trip completion', async () => {
      const tripId = faker.number.int();

      const errorMessage = 'An unknown error occurred';
      jest
        .spyOn(service, 'completeTrip')
        .mockRejectedValue(new Error(errorMessage));

      const result = await controller.completeTrip(tripId);

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.data).toBeUndefined();
      expect(result.errorMessage).toEqual(errorMessage);
    });
  });

  describe('getAllActiveTrips', () => {
    it('should return all active trips', async () => {
      const mockTrips: TripDto[] = [TripsMock.generateRandomTripDto()];

      jest.spyOn(service, 'findActiveTrips').mockResolvedValue({
        records: mockTrips,
        totalRecords: mockTrips.length,
      });

      const result = await controller.getAllActiveTrips();

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(HttpStatus.OK);
      expect(result.data).toEqual({
        records: mockTrips,
        totalRecords: mockTrips.length,
      });
      expect(result.errorMessage).toBeUndefined();
    });

    it('should handle errors during retrieval', async () => {
      const errorMessage = 'An unknown error occurred';
      jest
        .spyOn(service, 'findActiveTrips')
        .mockRejectedValue(new Error(errorMessage));

      const result = await controller.getAllActiveTrips();

      expect(result).toBeInstanceOf(HttpResponse);
      expect(result.statusCode).toEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(result.data).toBeUndefined();
      expect(result.errorMessage).toEqual(errorMessage);
    });
  });

  describe('getCompletedTripBill', () => {
    it('should return completed trip bill', async () => {
      const tripId = faker.number.int();
      const tripDto: TripDto =
        TripsMock.generateRandomCompletedTripDtoWithSpecificId(tripId);

      jest.spyOn(service, 'findById').mockResolvedValue(tripDto);
      jest
        .spyOn(service, 'generateBillPdf')
        .mockResolvedValue(Buffer.from('PDF Buffer'));

      const res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await controller.getCompletedTripBill(tripId, res);

      expect(service.findById).toHaveBeenCalledWith(tripId);
      expect(service.generateBillPdf).toHaveBeenCalledWith(tripDto);
      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Type',
        'application/pdf',
      );
      expect(res.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        `attachment; filename="taxi24-viaje-${tripId}-factura.pdf"`,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalledWith(Buffer.from('PDF Buffer'));
    });

    it('should handle trip not found', async () => {
      const tripId = faker.number.int();

      jest.spyOn(service, 'findById').mockResolvedValue(undefined);

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await controller.getCompletedTripBill(tripId, res);

      expect(service.findById).toHaveBeenCalledWith(tripId);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.send).toHaveBeenCalledWith({ errorMessage: 'Trip not found' });
    });

    it('should handle internal server error', async () => {
      const tripId = faker.number.int();
      const errorMessage = 'An unknown error occurred';

      jest
        .spyOn(service, 'findById')
        .mockRejectedValue(new Error(errorMessage));

      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await controller.getCompletedTripBill(tripId, res);

      expect(service.findById).toHaveBeenCalledWith(tripId);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.send).toHaveBeenCalledWith({ errorMessage });
    });
  });
});
