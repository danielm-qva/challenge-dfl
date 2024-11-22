import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  fromCurrency: string;

  @IsNotEmpty()
  @IsString()
  toCurrency: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  transactionType: string;

  @IsString()
  @IsOptional()
  userId: string;
}
