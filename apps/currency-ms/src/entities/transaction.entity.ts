import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { TransactionTypeModel } from '../../../transaction-ms/src/entities/transaction-type.entity';

export type TransactionDocument = HydratedDocument<TransactionModel>;

@Schema({ timestamps: true, collection: 'transaction' })
export class TransactionModel extends Document {
  @Prop({ required: true })
  transactionCode: string;

  @Prop({ required: true })
  fromCurrency: string;

  @Prop({ required: true })
  toCurrency: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  amountConverted: number;

  @Prop({ required: true })
  exchangeRate: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: TransactionTypeModel.name,
    required: true,
  })
  transactionType: TransactionTypeModel;

  @Prop()
  userId: string;
}

export const TransactionSchema = SchemaFactory.createForClass(TransactionModel);

TransactionSchema.index({ transactionType: 1 });
