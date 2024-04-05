import { Repository } from 'typeorm';
import { Driver } from '../../../modules/drivers/drivers.entity';

export class DriversRepositoryMock extends Repository<Driver> {
  public async save(driver: any): Promise<any> {
    return driver;
  }

  public createQueryBuilder(): any {
    return {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };
  }
}
