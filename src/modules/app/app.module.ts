import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../../config/database/database.module';
import { DriversModule } from '../drivers/drivers.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule.forRoot(), DriversModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
