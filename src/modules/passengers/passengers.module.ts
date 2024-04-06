import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Passenger } from './passengers.entity';
import { PassengersService } from './passengers.service';
import { PassengersController } from './passengers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Passenger])],
  providers: [PassengersService],
  controllers: [PassengersController],
})
export class PassengersModule {}
