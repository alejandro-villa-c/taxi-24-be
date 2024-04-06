import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import { Trip } from '../trips/trips.entity';

@Entity('passengers')
export class Passenger {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public givenName!: string;

  @Column()
  public familyName!: string;

  @OneToMany(() => Trip, (trip) => trip.passenger)
  public trips?: Relation<Trip[]>;
}
