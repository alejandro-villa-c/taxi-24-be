import { Repository } from 'typeorm';
import { Passenger } from '../../../modules/passengers/passengers.entity';

export class PassengersRepositoryMock extends Repository<Passenger> {
  public async save(passenger: any): Promise<any> {
    return passenger;
  }

  public findAndCount = jest.fn().mockResolvedValue([[], 0]);

  public find = jest.fn().mockResolvedValue([]);

  public findOne = jest.fn().mockResolvedValue(undefined);
}
