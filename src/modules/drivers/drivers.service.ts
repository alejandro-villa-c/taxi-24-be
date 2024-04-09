import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './drivers.entity';
import { CreateDriverDto } from './dtos/create-driver.dto';
import { DriverDto } from './dtos/driver.dto';
import { GisUtils } from '../../utils/gis.utils';
import { PaginatedResponse } from '../../shared/paginated-response';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(Driver)
    private readonly driversRepository: Repository<Driver>,
  ) {}

  public async create(createDriverDto: CreateDriverDto): Promise<DriverDto> {
    const { givenName, familyName, latitude, longitude } = createDriverDto;

    const driver = new Driver();
    driver.givenName = givenName;
    driver.familyName = familyName;
    driver.latitude = Number(latitude);
    driver.longitude = Number(longitude);

    const createdDriver = await this.driversRepository.save(driver);
    const driverDto = new DriverDto(
      createdDriver.id,
      createdDriver.givenName,
      createdDriver.familyName,
      createdDriver.latitude,
      createdDriver.longitude,
    );

    return driverDto;
  }

  public async findAll(
    page?: number,
    perPage?: number,
  ): Promise<PaginatedResponse<DriverDto[]>> {
    let records: Driver[];
    let totalRecords: number;
    if (page && perPage) {
      [records, totalRecords] = await this.driversRepository.findAndCount({
        skip: (page - 1) * perPage,
        take: perPage,
      });
    } else {
      records = await this.driversRepository.find();
      totalRecords = records.length;
    }
    const driverDtos = records.map((record) => {
      return new DriverDto(
        record.id,
        record.givenName,
        record.familyName,
        record.latitude,
        record.longitude,
      );
    });
    return { records: driverDtos, totalRecords };
  }

  public async findById(id: number): Promise<DriverDto | undefined> {
    const driver = await this.driversRepository.findOne({
      where: {
        id,
      },
    });
    if (!driver) {
      return undefined;
    }
    return new DriverDto(
      driver.id,
      driver.givenName,
      driver.familyName,
      driver.latitude,
      driver.longitude,
    );
  }

  public async searchDrivers(
    latitude: number,
    longitude: number,
    distance?: number,
    getAvailableDrivers?: boolean,
    page?: number,
    perPage?: number,
  ): Promise<PaginatedResponse<DriverDto[]>> {
    const radiansLatitude = GisUtils.degreesToRadians(latitude);
    const radiansLongitude = GisUtils.degreesToRadians(longitude);
    const getDriversDistanceQuery = `
      ACOS(
        SIN(RADIANS(driver.latitude)) * SIN(${radiansLatitude}) +
        COS(RADIANS(driver.latitude)) * COS(${radiansLatitude}) *
        COS(RADIANS(driver.longitude) - ${radiansLongitude})
      ) * ${GisUtils.earthRadiusKm}
    `;

    let selectQuery = this.driversRepository
      .createQueryBuilder('driver')
      .select()
      .addSelect(getDriversDistanceQuery, 'distance');

    if (getAvailableDrivers) {
      selectQuery = selectQuery
        .leftJoin('driver.trips', 'trip')
        .groupBy('driver.id')
        .having(
          'COUNT(trip.id) = 0 OR SUM(CASE WHEN trip.isActive = true THEN 1 ELSE 0 END) = 0',
        );
    }

    if (distance) {
      selectQuery = selectQuery.andWhere(`
          ${getDriversDistanceQuery} <= ${distance}
        `);
    }

    selectQuery = selectQuery.orderBy('distance', 'ASC');

    let records: Driver[];
    let totalRecords: number;
    if (page && perPage) {
      [records, totalRecords] = await selectQuery
        .skip((page - 1) * perPage)
        .take(perPage)
        .getManyAndCount();
    } else {
      records = await selectQuery.getMany();
      totalRecords = records.length;
    }

    const driverDtos: DriverDto[] = records.map((record) => {
      return new DriverDto(
        record.id,
        record.givenName,
        record.familyName,
        record.latitude,
        record.longitude,
      );
    });

    return { records: driverDtos, totalRecords };
  }
}
