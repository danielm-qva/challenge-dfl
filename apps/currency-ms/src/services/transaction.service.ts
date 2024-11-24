import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryRequestDto } from '../../../challenge-dfl/src/dto';
import { AssignCodeService } from './AssignCode.service';
import { JobService } from './Job.service';
import { RpcException } from '@nestjs/microservices';
import {
  TransactionDocument,
  TransactionModel,
} from '../entities/transaction.entity';
import {
  TransactionTypeDocument,
  TransactionTypeModel,
} from '../../../transaction-ms/src/entities/transaction-type.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(TransactionModel.name)
    private Transaction: Model<TransactionDocument>,
    @InjectModel(TransactionTypeModel.name)
    private TransactionType: Model<TransactionTypeDocument>,
    private assignCodeService: AssignCodeService,
    @Inject(forwardRef(() => JobService))
    private jobService: JobService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  private readonly logger = new Logger(TransactionService.name);

  async create(createTransactionDto: CreateTransactionDto) {
    const transactionType = await this.TransactionType.findById(
      createTransactionDto.transactionType,
    ).exec();
    if (!transactionType) {
      return new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'transaction type not found',
      });
    }
    const { code, codeFinal } = this.assignCodeService.getFirstAvailableCode();
    const exchangeRate =
      createTransactionDto.fromCurrency === createTransactionDto.toCurrency
        ? 1
        : this.jobService.getExchangeRate(
            createTransactionDto.fromCurrency,
            createTransactionDto.toCurrency,
          );

    try {
      const document: any = {
        ...createTransactionDto,
        transactionCode: codeFinal,
        amountConverted: exchangeRate * createTransactionDto.amount,
        exchangeRate,
        userId: createTransactionDto.userId,
      };
      const newTransaction = await this.Transaction.create(document);
      if (!newTransaction) {
        return new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'transaction not created',
        });
      }
      this.assignCodeService.delete(code);
      return newTransaction;
    } catch (error: any) {
      this.assignCodeService.update(code, false);
      return new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'transaction not created',
      });
    }
  }

  async findAll(queryReq: QueryRequestDto) {
    const query: any = {};
    if (queryReq.startDate) {
      query.createdAt = {
        ...query.createdAt,
        $gte: new Date(queryReq.startDate),
      };
    }
    if (queryReq.endDate) {
      query.createdAt = {
        ...query.createdAt,
        $lte: new Date(queryReq.endDate),
      };
    }
    if (queryReq.transactionType) {
      query.transactionType = queryReq.transactionType;
    }

    const result = await this.Transaction.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'transactionType',
          localField: 'transactionType',
          foreignField: '_id',
          as: 'transactionTypeDoc',
        },
      },
      {
        $unwind: {
          path: '$transactionTypeDoc',
        },
      },
      {
        $project: {
          transactionType: '$transactionTypeDoc.name',
          transactionCode: 1,
          fromCurrency: 1,
          toCurrency: 1,
          amount: 1,
          amountConverted: 1,
          exchangeRate: 1,
          userId: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $skip: (queryReq.page - 1) * queryReq.size },
      { $limit: queryReq.size },
    ]);

    const total = await this.Transaction.countDocuments(query).exec();

    return { total, data: result };
  }

  async findOne(id: number) {
    try {
      const transaction = await this.Transaction.findById(id)
        .populate('transactionType', 'name', this.TransactionType)
        .exec();
      if (!transaction) {
        return new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Transaction not found',
        });
      }
      return {
        ...transaction.toObject(),
        transactionType: transaction.transactionType?.name || null,
      };
    } catch (error: any) {
      this.logger.error(error);
      return new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'transaction not found',
      });
    }
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    try {
      return await this.Transaction.findByIdAndUpdate(
        id,
        updateTransactionDto,
        {
          new: true,
        },
      ).exec();
    } catch (e) {
      return new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'transaction not udpate',
      });
    }
  }

  async remove(id: number) {
    try {
      return await this.Transaction.findByIdAndDelete(id).exec();
    } catch (e) {
      return new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'transaction not is remove',
      });
    }
  }

  async getLastRecord() {
    return await this.Transaction.findOne().sort({ createdAt: -1 }).exec();
  }
}
