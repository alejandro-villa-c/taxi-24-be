import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponse<T> {
  @ApiProperty()
  public records!: T;

  @ApiProperty()
  public totalRecords!: number;
}
