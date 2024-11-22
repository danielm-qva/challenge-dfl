import { Module } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { TransactionController } from '../controller/transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TransactionModel,
  TransactionSchema,
} from '../entities/transaction.entity';
import { AssignCodeService } from '../services/AssignCode.service';
import { JobService } from '../services/Job.service';
import { HttpModule } from '@nestjs/axios';
import {
  TransactionTypeModel,
  TransactionTypeSchema,
} from '../../../transaction-ms/src/entities/transaction-type.entity';
import { StatisticsService } from '../services/statistics.service';
import { StatisticsController } from '../controller/statistics.controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.NEST_MONGO_URL || 'mongodb://localhost:27017/challenge-dfl',
    ),
    HttpModule,
    MongooseModule.forFeature([
      {
        name: TransactionModel.name,
        schema: TransactionSchema,
      },
      {
        name: TransactionTypeModel.name,
        schema: TransactionTypeSchema,
      },
    ]),
  ],
  controllers: [TransactionController, StatisticsController],
  providers: [
    TransactionService,
    AssignCodeService,
    JobService,
    StatisticsService,
  ],
})
export class TransactionModule {}
