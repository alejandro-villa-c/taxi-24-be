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

  public async findDriversWithinDistance(
    distance: number,
    latitude: number,
    longitude: number,
  ): Promise<DriverDto[]> {
    const radiansLat = GisUtils.degreesToRadians(latitude);
    const radiansLong = GisUtils.degreesToRadians(longitude);

    const driversWithinDistance = await this.driversRepository
      .createQueryBuilder('driver')
      .select()
      .where(
        `ACOS(
          SIN( RADIANS(driver.latitude) ) * SIN( ${radiansLat} ) +
          COS( RADIANS(driver.latitude) ) * COS( ${radiansLat} ) *
          COS( RADIANS(driver.longitude) - ${radiansLong} )
        ) * ${GisUtils.earthRadiusKm} <= ${distance}`,
      )
      .getMany();

    const driverDtos: DriverDto[] = driversWithinDistance.map((driver) => {
      return new DriverDto(
        driver.id,
        driver.givenName,
        driver.familyName,
        driver.latitude,
        driver.longitude,
      );
    });

    return driverDtos;
  }
}
