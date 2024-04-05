import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  givenName!: string;

  @Column()
  familyName!: string;

  @Column('decimal', { precision: 10, scale: 7 })
  latitude!: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitude!: number;
}
