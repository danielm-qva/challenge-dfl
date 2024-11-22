import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionTypeDocument = HydratedDocument<TransactionTypeModel>;

@Schema({ timestamps: true, collection: 'transactionType' })
export class TransactionTypeModel {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop()
  description: string;
}

export const TransactionTypeSchema =
  SchemaFactory.createForClass(TransactionTypeModel);
