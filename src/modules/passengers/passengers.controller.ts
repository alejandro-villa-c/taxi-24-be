import {
  Controller,
  Get,
  Query,
  HttpCode,
  Post,
  Body,
  ValidationPipe,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PassengersService } from './passengers.service';
import { PaginatedResponse } from '../../shared/paginated-response';
import { HttpResponse } from '../../shared/http-response';
import { PassengerDto } from './dtos/passenger.dto';
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
import { CreatePassengerDto } from './dtos/create-passenger.dto';

@ApiTags('Passengers')
@ApiExtraModels(HttpResponse, PaginatedResponse, PassengerDto)
@Controller('passengers')
export class PassengersController {
  constructor(private readonly passengersService: PassengersService) {}

  @Post()
  @HttpCode(201)
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(HttpResponse) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(PassengerDto),
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
    @Body(new ValidationPipe()) createPassengerDto: CreatePassengerDto,
  ): Promise<HttpResponse<PassengerDto | undefined>> {
    try {
      const createdPassengerDto =
        await this.passengersService.create(createPassengerDto);
      return new HttpResponse(createdPassengerDto, 201);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      return new HttpResponse(undefined, 500, errorMessage);
    }
  }

  @Get()
  @HttpCode(200)
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
                  items: { $ref: getSchemaPath(PassengerDto) },
                },
                totalRecords: {
                  type: 'number',
                },
              },
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
  public async getAll(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ): Promise<HttpResponse<PaginatedResponse<PassengerDto[]> | undefined>> {
    try {
      const parsedPage = page ? parseInt(page, 10) : undefined;
      const parsedPerPage = perPage ? parseInt(perPage, 10) : undefined;

      let paginatedResponse: PaginatedResponse<PassengerDto[]>;
      if (!parsedPage || !parsedPerPage) {
        paginatedResponse = await this.passengersService.findAll();
      } else {
        paginatedResponse = await this.passengersService.findAll(
          parsedPage,
          parsedPerPage,
        );
      }
      return new HttpResponse(paginatedResponse, 200);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      return new HttpResponse(undefined, 500, errorMessage);
    }
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(HttpResponse) },
        {
          properties: {
            data: { $ref: getSchemaPath(PassengerDto) },
            statusCode: { type: 'number', default: 200 },
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
            statusCode: { type: 'number', default: 404 },
            errorMessage: { type: 'string', default: 'Passenger not found' },
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
            statusCode: { type: 'number', default: 500 },
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
  ): Promise<HttpResponse<PassengerDto | undefined>> {
    try {
      const passenger = await this.passengersService.findById(id);
      if (!passenger) {
        return new HttpResponse(undefined, 404, 'Passenger not found');
      }
      return new HttpResponse(passenger, 200);
    } catch (error) {
      return new HttpResponse(undefined, 500, 'An unknown error occurred');
    }
  }
}
