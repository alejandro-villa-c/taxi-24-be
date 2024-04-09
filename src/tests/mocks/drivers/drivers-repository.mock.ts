import { Repository } from 'typeorm';
import { Driver } from '../../../modules/drivers/drivers.entity';

export class DriversRepositoryMock extends Repository<Driver> {
  public async save(driver: any): Promise<any> {
    return driver;
  }

  public findAndCount = jest.fn().mockResolvedValue([[], 0]);

  public find = jest.fn().mockResolvedValue([]);

  public findOne = jest.fn().mockResolvedValue(undefined);
}
