import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Relation,
} from 'typeorm';
import { Driver } from '../drivers/drivers.entity';
import { Passenger } from '../passengers/passengers.entity';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(() => Driver, (driver) => driver.trips)
  public driver!: Relation<Driver>;

  @ManyToOne(() => Passenger, (passenger) => passenger.trips)
  public passenger!: Relation<Passenger>;

  @CreateDateColumn()
  public startDate!: Date;

  @Column()
  public endDate!: Date;

  @Column({
    default: true,
  })
  public isActive!: boolean;

  @Column('decimal', {
    precision: 10,
    scale: 7,
    transformer: {
      to: (value: number) => String(value),
      from: (value: string) => Number(value),
    },
  })
  public startLatitude!: number;

  @Column('decimal', {
    precision: 10,
    scale: 7,
    transformer: {
      to: (value: number) => String(value),
      from: (value: string) => Number(value),
    },
  })
  public startLongitude!: number;

  @Column('decimal', {
    precision: 10,
    scale: 7,
    transformer: {
      to: (value: number) => String(value),
      from: (value: string) => Number(value),
    },
  })
  public endLatitude!: number;

  @Column('decimal', {
    precision: 10,
    scale: 7,
    transformer: {
      to: (value: number) => String(value),
      from: (value: string) => Number(value),
    },
  })
  public endLongitude!: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => String(value),
      from: (value: string) => Number(value),
    },
  })
  public price!: number;

  @Column()
  public priceCurrency!: string;
}
