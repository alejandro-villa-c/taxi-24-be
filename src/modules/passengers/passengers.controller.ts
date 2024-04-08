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
  HttpStatus,
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
  @HttpCode(HttpStatus.CREATED)
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
    @Body(new ValidationPipe()) createPassengerDto: CreatePassengerDto,
  ): Promise<HttpResponse<PassengerDto | undefined>> {
    try {
      const createdPassengerDto =
        await this.passengersService.create(createPassengerDto);
      return new HttpResponse(createdPassengerDto, HttpStatus.CREATED);
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
                  items: { $ref: getSchemaPath(PassengerDto) },
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
  ): Promise<HttpResponse<PaginatedResponse<PassengerDto[]> | undefined>> {
    try {
      const parsedPage = page ? parseInt(page, 10) : undefined;
      const parsedPerPage = perPage ? parseInt(perPage, 10) : undefined;

      const paginatedResponse: PaginatedResponse<PassengerDto[]> =
        await this.passengersService.findAll(parsedPage, parsedPerPage);

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

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(HttpResponse) },
        {
          properties: {
            data: { $ref: getSchemaPath(PassengerDto) },
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
  ): Promise<HttpResponse<PassengerDto | undefined>> {
    try {
      const passenger = await this.passengersService.findById(id);
      if (!passenger) {
        return new HttpResponse(
          undefined,
          HttpStatus.NOT_FOUND,
          'Passenger not found',
        );
      }
      return new HttpResponse(passenger, HttpStatus.OK);
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
