import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './trips.entity';
import { CreateTripDto } from './dtos/create-trip.dto';
import { TripDto } from './dtos/trip.dto';
import { PaginatedResponse } from '../../shared/paginated-response';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripsRepository: Repository<Trip>,
  ) {}

  public async create(createTripDto: CreateTripDto): Promise<TripDto> {
    const {
      driverId,
      passengerId,
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      price,
    } = createTripDto;

    const hasActiveTrip = await this.tripsRepository.findOne({
      where: [
        { driverId, isActive: true },
        { passengerId, isActive: true },
      ],
    });

    if (hasActiveTrip) {
      throw new ConflictException(
        'Driver or passenger already has an active trip',
      );
    }

    const trip = new Trip();
    trip.driverId = driverId;
    trip.passengerId = passengerId;
    trip.isActive = true;
    trip.startLatitude = Number(startLatitude);
    trip.startLongitude = Number(startLongitude);
    trip.endLatitude = Number(endLatitude);
    trip.endLongitude = Number(endLongitude);
    trip.price = Number(price);
    trip.priceCurrency = 'DOP';

    const createdTrip = await this.tripsRepository.save(trip);

    return new TripDto(
      createdTrip.id,
      createdTrip.driverId,
      createdTrip.passengerId,
      createdTrip.startDate,
      createdTrip.endDate,
      createdTrip.isActive,
      createdTrip.startLatitude,
      createdTrip.startLongitude,
      createdTrip.endLatitude,
      createdTrip.endLongitude,
      createdTrip.price,
      createdTrip.priceCurrency,
    );
  }

  public async completeTrip(tripId: number): Promise<TripDto> {
    const trip = await this.tripsRepository.findOne({
      where: {
        id: tripId,
      },
    });
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    trip.endDate = new Date();
    trip.isActive = false;

    const createdTrip = await this.tripsRepository.save(trip);
    return new TripDto(
      createdTrip.id,
      createdTrip.driverId,
      createdTrip.passengerId,
      createdTrip.startDate,
      createdTrip.endDate,
      createdTrip.isActive,
      createdTrip.startLatitude,
      createdTrip.startLongitude,
      createdTrip.endLatitude,
      createdTrip.endLongitude,
      createdTrip.price,
      createdTrip.priceCurrency,
    );
  }

  public async findActiveTrips(
    page?: number,
    perPage?: number,
  ): Promise<PaginatedResponse<TripDto[]>> {
    let records: Trip[];
    let totalRecords: number;
    if (page && perPage) {
      [records, totalRecords] = await this.tripsRepository.findAndCount({
        where: {
          isActive: true,
        },
        skip: (page - 1) * perPage,
        take: perPage,
      });
    } else {
      records = await this.tripsRepository.find({
        where: {
          isActive: true,
        },
      });
      totalRecords = records.length;
    }
    const tripDtos = records.map((record) => {
      return new TripDto(
        record.id,
        record.driverId,
        record.passengerId,
        record.startDate,
        record.endDate,
        record.isActive,
        record.startLatitude,
        record.startLongitude,
        record.endLatitude,
        record.endLongitude,
        record.price,
        record.priceCurrency,
      );
    });
    return { records: tripDtos, totalRecords };
  }
}
