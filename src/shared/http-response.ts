import { ApiProperty } from '@nestjs/swagger';

export class HttpResponse<T> {
  @ApiProperty()
  public data: T;

  @ApiProperty()
  public statusCode: number;

  @ApiProperty()
  public errorMessage?: string;

  constructor(data: T, statusCode: number, errorMessage?: string) {
    this.data = data;
    this.statusCode = statusCode;
    this.errorMessage = errorMessage;
  }
}
