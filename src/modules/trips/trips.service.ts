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
import * as PDFDocument from 'pdfkit';
import { NumberUtils } from '../../utils/number.utils';

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
      undefined,
      createdTrip.passengerId,
      undefined,
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

    const completedTrip = await this.tripsRepository.save(trip);
    return new TripDto(
      completedTrip.id,
      completedTrip.driverId,
      undefined,
      completedTrip.passengerId,
      undefined,
      completedTrip.startDate,
      completedTrip.endDate,
      completedTrip.isActive,
      completedTrip.startLatitude,
      completedTrip.startLongitude,
      completedTrip.endLatitude,
      completedTrip.endLongitude,
      completedTrip.price,
      completedTrip.priceCurrency,
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
        undefined,
        record.passengerId,
        undefined,
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

  public async findById(id: number): Promise<TripDto | undefined> {
    const trip = await this.tripsRepository.findOne({
      where: {
        id,
        isActive: false,
      },
      relations: {
        driver: true,
        passenger: true,
      },
    });
    if (!trip) {
      return undefined;
    }
    return new TripDto(
      trip.id,
      trip.driverId,
      trip.driver.givenName,
      trip.passengerId,
      trip.passenger.givenName,
      trip.startDate,
      trip.endDate,
      trip.isActive,
      trip.startLatitude,
      trip.startLongitude,
      trip.endLatitude,
      trip.endLongitude,
      trip.price,
      trip.priceCurrency,
    );
  }

  public async generateBillPdf(tripDto: TripDto): Promise<Buffer> {
    return new Promise((resolve) => {
      const pdfDocument = new PDFDocument();
      const chunks: Uint8Array[] = [];

      pdfDocument.on('data', (chunk: Uint8Array) => {
        chunks.push(chunk);
      });

      pdfDocument.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

      pdfDocument.text(`
        Factura de tu viaje con Taxi24.
        \n
        Gracias por viajar con nosotros, ${tripDto.passengerGivenName}.
        \n
        Fecha inicial: ${new Date(tripDto.startDate).toLocaleString('es-DO')}
        \n
        Fecha final: ${new Date(tripDto.endDate!).toLocaleString('es-DO')}
        \n
        Total: ${tripDto.priceCurrency} ${NumberUtils.formatPrice(tripDto.price)}.
        \n
        Distancia recorrida: ${NumberUtils.formatNumber(tripDto.distance!)} km.
        \n
        Viajaste con ${tripDto.driverGivenName}.
      `);

      pdfDocument.end();
    });
  }
}
