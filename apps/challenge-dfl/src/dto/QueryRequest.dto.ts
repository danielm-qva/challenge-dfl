import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryRequestDto {
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate: Date;

  @IsString()
  @IsOptional()
  transactionType: string;

  @IsNumber()
  @IsOptional()
  page: number = 1;

  @IsNumber()
  @IsOptional()
  size: number = 10;
}
