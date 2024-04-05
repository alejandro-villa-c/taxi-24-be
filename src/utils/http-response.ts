import { ApiProperty } from '@nestjs/swagger';

export class HttpResponse<T> {
  @ApiProperty()
  data: T;

  @ApiProperty()
  errorMessage?: string;

  @ApiProperty()
  statusCode: number;

  constructor(data: T, errorMessage?: string, statusCode: number = 200) {
    this.data = data;
    this.errorMessage = errorMessage;
    this.statusCode = statusCode;
  }
}
