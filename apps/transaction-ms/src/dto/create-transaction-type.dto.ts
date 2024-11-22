import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTransactionTypeDto {
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
