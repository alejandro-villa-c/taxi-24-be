import { Repository } from 'typeorm';
import { Trip } from '../../../modules/trips/trips.entity';

export class TripsRepositoryMock extends Repository<Trip> {
  public async save(driver: any): Promise<any> {
    return driver;
  }

  public findAndCount = jest.fn().mockResolvedValue([[], 0]);

  public find = jest.fn().mockResolvedValue([]);

  public findOne = jest.fn().mockResolvedValue(undefined);
}
