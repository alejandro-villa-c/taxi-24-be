import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './drivers.entity';
import { CreateDriverDto } from './dtos/create-driver.dto';
import { DriverDto } from './dtos/driver.dto';

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

  public async findDriversWithinDistance(
    distance: number,
    latitude: number,
    longitude: number,
  ): Promise<DriverDto[]> {
    const earthRadiusKm = 6371;
    const radiansLat = this.degreesToRadians(latitude);
    const radiansLong = this.degreesToRadians(longitude);

    const driversWithinDistance = await this.driversRepository
      .createQueryBuilder('driver')
      .select()
      .where(
        `ACOS(
          SIN( RADIANS(driver.latitude) ) * SIN( ${radiansLat} ) +
          COS( RADIANS(driver.latitude) ) * COS( ${radiansLat} ) *
          COS( RADIANS(driver.longitude) - ${radiansLong} )
        ) * ${earthRadiusKm} <= ${distance}`,
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

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
