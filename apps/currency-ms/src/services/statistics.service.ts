import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  TransactionDocument,
  TransactionModel,
} from '../entities/transaction.entity';
import { Model } from 'mongoose';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(TransactionModel.name)
    private Transaction: Model<TransactionDocument>,
  ) {}

  private readonly logger = new Logger(StatisticsService.name);

  async getTotalTransactions() {
    const totalTransactions = await this.Transaction.countDocuments().exec();
    return { totalTransactions };
  }

  async getTransactionsByType() {
    const transactionsByType = await this.Transaction.aggregate(
      [
        {
          $lookup: {
            from: 'transactionType',
            localField: 'transactionType',
            foreignField: '_id',
            as: 'result',
          },
        },
        { $unwind: { path: '$result' } },
        {
          $group: {
            _id: '$result.name',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            type: '$_id',
            count: 1,
          },
        },
      ],
      { maxTimeMS: 60000, allowDiskUse: true },
    );
    return {
      transactionsByType: Object.fromEntries(
        transactionsByType.map(({ type, count }) => [type, count]),
      ),
    };
  }

  async getTotalAmountConvertedByCurrency() {
    const totalAmountConvertedByCurrency = await this.Transaction.aggregate([
      {
        $group: {
          _id: '$toCurrency',
          total: { $sum: '$amountConverted' },
        },
      },
      {
        $project: {
          _id: 0,
          currency: '$_id',
          total: 1,
        },
      },
    ]);

    return {
      totalAmountConvertedByCurrency: Object.fromEntries(
        totalAmountConvertedByCurrency.map(({ currency, total }) => [
          currency,
          total,
        ]),
      ),
    };
  }

  async getTotalAmountByTransactionType() {
    const totalAmountByTransactionType = await this.Transaction.aggregate([
      {
        $lookup: {
          from: 'transactionType',
          localField: 'transactionType',
          foreignField: '_id',
          as: 'transactionType',
        },
      },
      { $unwind: { path: '$transactionType' } },
      {
        $group: {
          _id: '$transactionType.name',
          total: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          total: 1,
        },
      },
    ]);

    return {
      totalAmountByTransactionType: Object.fromEntries(
        totalAmountByTransactionType.map(({ type, total }) => [type, total]),
      ),
    };
  }

  async getAverageAmountByTransactionType() {
    const averageAmountByTransactionType = await this.Transaction.aggregate([
      {
        $lookup: {
          from: 'transactionType',
          localField: 'transactionType',
          foreignField: '_id',
          as: 'transactionType',
        },
      },
      {
        $unwind: '$transactionType',
      },
      {
        $group: {
          _id: '$transactionType.name',
          average: { $avg: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          average: 1,
        },
      },
    ]);

    return {
      averageAmountByTransactionType: Object.fromEntries(
        averageAmountByTransactionType.map(({ type, average }) => [
          type,
          average,
        ]),
      ),
    };
  }

  async getReportStatistics() {
    const [
      totalTransactions,
      transactionsByType,
      getTotalAmountConvertedByCurrency,
      getTotalAmountByTransactionType,
      getAverageAmountByTransactionType,
    ] = await Promise.all([
      this.getTotalTransactions(),
      this.getTransactionsByType(),
      this.getTotalAmountConvertedByCurrency(),
      this.getTotalAmountByTransactionType(),
      this.getAverageAmountByTransactionType(),
    ]);
    return {
      ...totalTransactions,
      ...transactionsByType,
      ...getTotalAmountConvertedByCurrency,
      ...getTotalAmountByTransactionType,
      ...getAverageAmountByTransactionType,
    };
  }
}
