import {
  Controller,
  Get,
  Query,
  ParseFloatPipe,
  Param,
  ParseIntPipe,
  Post,
  Body,
  ValidationPipe,
  HttpCode,
  UsePipes,
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dtos/create-driver.dto';
import { HttpResponse } from '../../shared/http-response';
import { DriverDto } from './dtos/driver.dto';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@ApiTags('Drivers')
@ApiExtraModels(HttpResponse, DriverDto)
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @HttpCode(201)
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(HttpResponse) },
        {
          properties: {
            data: {
              type: 'object',
              $ref: getSchemaPath(DriverDto),
            },
            statusCode: {
              type: 'number',
              default: 201,
            },
            errorMessage: {
              type: 'string',
              nullable: true,
            },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(HttpResponse) },
        {
          properties: {
            data: {
              type: 'object',
              nullable: true,
            },
            statusCode: {
              type: 'number',
              default: 400,
            },
            errorMessage: {
              type: 'string',
              default: 'Bad Request',
            },
          },
        },
      ],
    },
  })
  @ApiInternalServerErrorResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(HttpResponse) },
        {
          properties: {
            data: {
              type: 'object',
              nullable: true,
            },
            statusCode: {
              type: 'number',
              default: 500,
            },
            errorMessage: {
              type: 'string',
              default: 'An unknown error occurred',
            },
          },
        },
      ],
    },
  })
  public async create(
    @Body(new ValidationPipe()) createDriverDto: CreateDriverDto,
  ): Promise<HttpResponse<DriverDto | undefined>> {
    try {
      const createdDriverDto =
        await this.driversService.create(createDriverDto);
      return new HttpResponse(createdDriverDto, 201);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      return new HttpResponse(undefined, 500, errorMessage);
    }
  }

  @Get('/within/:distance/km')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(HttpResponse) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(DriverDto) },
            },
            statusCode: {
              type: 'number',
              default: 200,
            },
            errorMessage: {
              type: 'string',
              nullable: true,
            },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(HttpResponse) },
        {
          properties: {
            data: {
              type: 'array',
              nullable: true,
            },
            statusCode: {
              type: 'number',
              default: 400,
            },
            errorMessage: {
              type: 'string',
              default: 'Bad Request',
            },
          },
        },
      ],
    },
  })
  @ApiInternalServerErrorResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(HttpResponse) },
        {
          properties: {
            data: {
              type: 'array',
              nullable: true,
            },
            statusCode: {
              type: 'number',
              default: 500,
            },
            errorMessage: {
              type: 'string',
              default: 'An unknown error occurred',
            },
          },
        },
      ],
    },
  })
  public async getDriversWithinDistance(
    @Param('distance', ParseIntPipe) distance: number,
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
  ): Promise<HttpResponse<DriverDto[] | undefined>> {
    try {
      const drivers = await this.driversService.findDriversWithinDistance(
        distance,
        latitude,
        longitude,
      );
      return new HttpResponse(drivers, 200);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      return new HttpResponse(undefined, 500, errorMessage);
    }
  }
}
