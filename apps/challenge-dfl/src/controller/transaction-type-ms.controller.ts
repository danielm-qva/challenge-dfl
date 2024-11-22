import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TRANSACTION_TYPE_SERVICE } from '../config/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTransactionTypeDto } from '../../../transaction-ms/src/dto/create-transaction-type.dto';
import { firstValueFrom } from 'rxjs';
import { UpdateTransactionTypeDto } from '../../../transaction-ms/src/dto/update-transaction-type.dto';
import { AppAuthGuards } from '../guards/app-auth.guards';
import { ParseObjectIdPipe } from '../pipe/parse-object-id.pipe';
import { QueryRequestDto } from '../dto';

@Controller('settings/transaction-type')
@UseGuards(AppAuthGuards)
export class TransactionTypeMsController {
  constructor(
    @Inject(TRANSACTION_TYPE_SERVICE)
    private readonly clientTransactionType: ClientProxy,
  ) {}

  @Get()
  getAllTransactionType(@Query() queryReq: QueryRequestDto) {
    return this.clientTransactionType.send(
      { cmd: 'findAllTransactionType' },
      { queryReq },
    );
  }

  @Get(':id')
  async findOneTransactionType(@Param('id', ParseObjectIdPipe) _id: string) {
    return firstValueFrom(
      this.clientTransactionType.send({ cmd: 'findOneTransactionType' }, _id),
    );
  }

  @Post()
  createTransactionType(
    @Body() createTransactionTypeDto: CreateTransactionTypeDto,
  ) {
    return this.clientTransactionType.send(
      { cmd: 'createTransactionType' },
      createTransactionTypeDto,
    );
  }

  @Patch(':id')
  async updateTransactionType(
    @Param('id', ParseObjectIdPipe) idTransactionType: string,
    @Body() updateTransactionTypeDto: UpdateTransactionTypeDto,
  ) {
    return this.clientTransactionType.send(
      { cmd: 'updateTransactionType' },
      { data: updateTransactionTypeDto, _id: idTransactionType },
    );
  }

  @Delete(':id')
  async deleteTransactionType(
    @Param('id', ParseObjectIdPipe) idTransactionType: string,
  ) {
    return this.clientTransactionType.send(
      { cmd: 'removeTransactionType' },
      { _id: idTransactionType },
    );
  }
}
