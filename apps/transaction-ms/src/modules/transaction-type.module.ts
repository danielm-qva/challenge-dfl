import { Module } from '@nestjs/common';
import { TransactionTypeService } from '../services/transaction-type.service';
import { TransactionTypeController } from '../controller/transaction-type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TransactionTypeModel,
  TransactionTypeSchema,
} from '../entities/transaction-type.entity';
import { normalizeName } from '../utils/normalizeName';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.NEST_MONGO_URL || 'mongodb://localhost:27017/challenge-dfl',
    ),
    MongooseModule.forFeatureAsync([
      {
        name: TransactionTypeModel.name,
        useFactory: () => {
          const schema = TransactionTypeSchema;
          schema.pre('save', function (next) {
            this.name = normalizeName(this.name);
            next();
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [TransactionTypeController],
  providers: [TransactionTypeService],
})
export class TransactionTypeModule {}
