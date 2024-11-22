import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { QueryRequestDto } from '../../../challenge-dfl/src/dto';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @MessagePattern({ cmd: 'createTransaction' })
  create(@Payload() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @MessagePattern({ cmd: 'findAllTransaction' })
  findAll(@Payload() queryReq: QueryRequestDto) {
    return this.transactionService.findAll(queryReq);
  }

  @MessagePattern({ cmd: 'findOneTransaction' })
  findOne(@Payload() id: number) {
    return this.transactionService.findOne(id);
  }

  @MessagePattern({ cmd: 'updateTransaction' })
  update(@Payload() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionService.update(
      updateTransactionDto.id,
      updateTransactionDto,
    );
  }

  @MessagePattern({ cmd: 'removeTransaction' })
  remove(@Payload() id: number) {
    return this.transactionService.remove(id);
  }
}
