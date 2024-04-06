import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Passenger } from './passengers.entity';
import { PaginatedResponse } from '../../shared/paginated-response';
import { PassengerDto } from './dtos/passenger.dto';
import { CreatePassengerDto } from './dtos/create-passenger.dto';

@Injectable()
export class PassengersService {
  constructor(
    @InjectRepository(Passenger)
    private readonly passengersRepository: Repository<Passenger>,
  ) {}

  public async create(
    createPassengerDto: CreatePassengerDto,
  ): Promise<PassengerDto> {
    const { givenName, familyName } = createPassengerDto;

    const passenger = new Passenger();
    passenger.givenName = givenName;
    passenger.familyName = familyName;

    const createdPassenger = await this.passengersRepository.save(passenger);
    const passengerDto = new PassengerDto(
      createdPassenger.id,
      createdPassenger.givenName,
      createdPassenger.familyName,
    );

    return passengerDto;
  }

  public async findAll(
    page?: number,
    perPage?: number,
  ): Promise<PaginatedResponse<PassengerDto[]>> {
    let records: Passenger[];
    let totalRecords: number;
    if (page && perPage) {
      [records, totalRecords] = await this.passengersRepository.findAndCount({
        skip: (page - 1) * perPage,
        take: perPage,
      });
    } else {
      records = await this.passengersRepository.find();
      totalRecords = records.length;
    }
    const passengerDtos = records.map((record) => {
      return new PassengerDto(record.id, record.givenName, record.familyName);
    });
    return { records: passengerDtos, totalRecords };
  }

  public async findById(id: number): Promise<PassengerDto | undefined> {
    const passenger = await this.passengersRepository.findOne({
      where: {
        id,
      },
    });
    if (!passenger) {
      return undefined;
    }
    return new PassengerDto(
      passenger.id,
      passenger.givenName,
      passenger.familyName,
    );
  }
}
