import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateTransactionTypeDto } from '../dto/create-transaction-type.dto';
import { UpdateTransactionTypeDto } from '../dto/update-transaction-type.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RpcException } from '@nestjs/microservices';
import { Model, ObjectId } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  TransactionTypeDocument,
  TransactionTypeModel,
} from '../entities/transaction-type.entity';
import { QueryRequestDto } from '../../../challenge-dfl/src/dto';

@Injectable()
export class TransactionTypeService {
  constructor(
    @InjectModel(TransactionTypeModel.name)
    private TransactionType: Model<TransactionTypeDocument>,
    @Inject(CACHE_MANAGER) private cacheServices: Cache,
  ) {}

  async create(createTransactionTypeDto: CreateTransactionTypeDto) {
    try {
      return await this.TransactionType.create(createTransactionTypeDto);
    } catch (error: any) {
      return new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'transactionType not created',
      });
    }
  }

  async findAll(queryReq: QueryRequestDto): Promise<any[]> {
    return this.TransactionType.find()
      .setOptions({ sanitizeFilter: true })
      .skip((queryReq.page - 1) * queryReq.size)
      .limit(queryReq.size)
      .exec();
  }

  async findOne(id: string) {
    const transactionType = await this.TransactionType.findById(id).exec();
    if (!transactionType) {
      return new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'transactionType not found',
      });
    }
    return transactionType;
  }

  async update(
    id: ObjectId,
    updateTransactionTypeDto: UpdateTransactionTypeDto,
  ) {
    const { _id: _, data } = updateTransactionTypeDto;

    const updateTransactionType = await this.TransactionType.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
      },
    );

    if (!updateTransactionType) {
      return new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'transactionType not udpate',
      });
    }
    return updateTransactionType;
  }

  async remove(id: number) {
    const deleteTransactionType = await this.TransactionType.findByIdAndDelete(
      id,
      {
        new: true,
      },
    ).exec();
    if (!deleteTransactionType) {
      return new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'transactionType not is remove',
      });
    }
    return deleteTransactionType;
  }
}
