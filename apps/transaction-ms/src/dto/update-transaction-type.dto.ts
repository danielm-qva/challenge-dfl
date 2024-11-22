import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionTypeDto } from './create-transaction-type.dto';
import { ObjectId } from 'mongoose';

export class UpdateTransactionTypeDto extends PartialType(
  CreateTransactionTypeDto,
) {
  _id: ObjectId;
  data: any;
}
