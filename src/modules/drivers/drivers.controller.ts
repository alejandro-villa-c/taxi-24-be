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
  HttpStatus,
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dtos/create-driver.dto';
import { HttpResponse } from '../../shared/http-response';
import { DriverDto } from './dtos/driver.dto';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedResponse } from '../../shared/paginated-response';

@ApiTags('Drivers')
@ApiExtraModels(HttpResponse, PaginatedResponse, DriverDto)
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
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
              default: HttpStatus.CREATED,
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
              default: HttpStatus.BAD_REQUEST,
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
              default: HttpStatus.INTERNAL_SERVER_ERROR,
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
      return new HttpResponse(createdDriverDto, HttpStatus.CREATED);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      return new HttpResponse(
        undefined,
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage,
      );
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(HttpResponse) },
        {
          properties: {
            data: {
              type: 'object',
              $ref: getSchemaPath(PaginatedResponse),
              properties: {
                records: {
                  type: 'array',
                  items: { $ref: getSchemaPath(DriverDto) },
                },
                totalRecords: {
                  type: 'number',
                },
              },
            },
            statusCode: {
              type: 'number',
              default: HttpStatus.OK,
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
              default: HttpStatus.BAD_REQUEST,
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
              default: HttpStatus.INTERNAL_SERVER_ERROR,
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
  public async getAll(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ): Promise<HttpResponse<PaginatedResponse<DriverDto[]> | undefined>> {
    try {
      const parsedPage = page ? Number(page) : undefined;
      const parsedPerPage = perPage ? Number(perPage) : undefined;

      const paginatedResponse: PaginatedResponse<DriverDto[]> =
        await this.driversService.findAll(parsedPage, parsedPerPage);

      return new HttpResponse(paginatedResponse, HttpStatus.OK);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      return new HttpResponse(
        undefined,
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage,
      );
    }
  }

  @Get('/search')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'distance', required: false })
  @ApiQuery({ name: 'getAvailableDrivers', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(HttpResponse) },
        {
          properties: {
            data: {
              type: 'object',
              $ref: getSchemaPath(PaginatedResponse),
              properties: {
                records: {
                  type: 'array',
                  items: { $ref: getSchemaPath(DriverDto) },
                },
                totalRecords: {
                  type: 'number',
                },
              },
            },
            statusCode: {
              type: 'number',
              default: HttpStatus.OK,
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
              default: HttpStatus.BAD_REQUEST,
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
              default: HttpStatus.INTERNAL_SERVER_ERROR,
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
  public async searchDrivers(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('distance') distance?: number,
    @Query('getAvailableDrivers') getAvailableDrivers?: boolean,
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ): Promise<HttpResponse<PaginatedResponse<DriverDto[]> | undefined>> {
    try {
      const parsedPage = page ? Number(page) : undefined;
      const parsedPerPage = perPage ? Number(perPage) : undefined;
      const parsedDistance = distance ? Number(distance) : undefined;
      const parsedGetAvailableDrivers =
        getAvailableDrivers && String(getAvailableDrivers) === 'true'
          ? true
          : false;

      const drivers = await this.driversService.searchDrivers(
        latitude,
        longitude,
        parsedDistance,
        parsedGetAvailableDrivers,
        parsedPage,
        parsedPerPage,
      );
      return new HttpResponse(drivers, HttpStatus.OK);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      return new HttpResponse(
        undefined,
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage,
      );
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(HttpResponse) },
        {
          properties: {
            data: { $ref: getSchemaPath(DriverDto) },
            statusCode: { type: 'number', default: HttpStatus.OK },
            errorMessage: { type: 'string', nullable: true },
          },
        },
      ],
    },
  })
  @ApiNotFoundResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(HttpResponse) },
        {
          properties: {
            data: { type: 'object', nullable: true },
            statusCode: { type: 'number', default: HttpStatus.NOT_FOUND },
            errorMessage: { type: 'string', default: 'Driver not found' },
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
            data: { type: 'object', nullable: true },
            statusCode: {
              type: 'number',
              default: HttpStatus.INTERNAL_SERVER_ERROR,
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
  public async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HttpResponse<DriverDto | undefined>> {
    try {
      const driver = await this.driversService.findById(id);
      if (!driver) {
        return new HttpResponse(
          undefined,
          HttpStatus.NOT_FOUND,
          'Driver not found',
        );
      }
      return new HttpResponse(driver, HttpStatus.OK);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      return new HttpResponse(
        undefined,
        HttpStatus.INTERNAL_SERVER_ERROR,
        errorMessage,
      );
    }
  }
}
