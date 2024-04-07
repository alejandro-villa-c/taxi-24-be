import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import { Trip } from '../trips/trips.entity';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public givenName!: string;

  @Column()
  public familyName!: string;

  @Column('decimal', {
    precision: 10,
    scale: 7,
    transformer: {
      to: (value: number) => String(value),
      from: (value: string) => Number(value),
    },
  })
  public latitude!: number;

  @Column('decimal', {
    precision: 10,
    scale: 7,
    transformer: {
      to: (value: number) => String(value),
      from: (value: string) => Number(value),
    },
  })
  public longitude!: number;

  @OneToMany(() => Trip, (trip) => trip.driver)
  public trips?: Relation<Trip[]>;
}
