import {
  Controller,
  Post,
  Body,
  HttpCode,
  ValidationPipe,
  Param,
  HttpStatus,
  ConflictException,
  Get,
  Query,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dtos/create-trip.dto';
import { HttpResponse } from '../../shared/http-response';
import { TripDto } from './dtos/trip.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedResponse } from '../../shared/paginated-response';
import { Response } from 'express';

@ApiTags('Trips')
@ApiExtraModels(HttpResponse, PaginatedResponse, TripDto)
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

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
              $ref: getSchemaPath(TripDto),
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
  @ApiConflictResponse({
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
              default: 'Driver or passenger already has an active trip',
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
    @Body(new ValidationPipe()) createTripDto: CreateTripDto,
  ): Promise<HttpResponse<TripDto | undefined>> {
    try {
      const createdTripDto = await this.tripsService.create(createTripDto);
      return new HttpResponse(createdTripDto, HttpStatus.CREATED);
    } catch (error) {
      if (error instanceof ConflictException) {
        return new HttpResponse(undefined, HttpStatus.CONFLICT, error.message);
      } else {
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

  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(HttpResponse) },
        {
          properties: {
            data: {
              type: 'object',
              $ref: getSchemaPath(TripDto),
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
  @ApiNotFoundResponse({
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
              default: HttpStatus.NOT_FOUND,
            },
            errorMessage: {
              type: 'string',
              default: 'Trip not found',
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
  public async completeTrip(
    @Param('id') id: number,
  ): Promise<HttpResponse<TripDto | undefined>> {
    try {
      const completedTripDto = await this.tripsService.completeTrip(id);
      return new HttpResponse(completedTripDto, HttpStatus.OK);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return new HttpResponse(undefined, HttpStatus.NOT_FOUND, error.message);
      } else {
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

  @Get('active')
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
                  items: { $ref: getSchemaPath(TripDto) },
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
  public async getAllActiveTrips(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ): Promise<HttpResponse<PaginatedResponse<TripDto[]> | undefined>> {
    try {
      const parsedPage = page ? Number(page) : undefined;
      const parsedPerPage = perPage ? Number(perPage) : undefined;

      const paginatedResponse = await this.tripsService.findActiveTrips(
        parsedPage,
        parsedPerPage,
      );

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

  @Get('completed/:id/bill')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    content: {
      'application/pdf': {},
    },
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        errorMessage: { type: 'string', default: 'Trip not found' },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      properties: {
        errorMessage: { type: 'string', default: 'An unknown error occurred' },
      },
    },
  })
  public async getCompletedTripBill(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const trip = await this.tripsService.findById(id);
      if (!trip) {
        throw new NotFoundException('Trip not found');
      }

      const pdfBuffer = await this.tripsService.generateBillPdf(trip);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="taxi24-viaje-${trip.id}-factura.pdf"`,
      );

      res.status(HttpStatus.OK).send(pdfBuffer);
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).send({ errorMessage: error.message });
      } else {
        const errorMessage =
          error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ errorMessage });
      }
    }
  }
}
