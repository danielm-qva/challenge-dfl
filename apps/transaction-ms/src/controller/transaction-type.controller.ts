import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionTypeService } from '../services/transaction-type.service';
import { CreateTransactionTypeDto } from '../dto/create-transaction-type.dto';
import { UpdateTransactionTypeDto } from '../dto/update-transaction-type.dto';
import { QueryRequestDto } from '../../../challenge-dfl/src/dto';

@Controller()
export class TransactionTypeController {
  constructor(
    private readonly transactionTypeService: TransactionTypeService,
  ) {}

  @MessagePattern({ cmd: 'createTransactionType' })
  create(@Payload() createTransactionTypeDto: CreateTransactionTypeDto) {
    return this.transactionTypeService.create(createTransactionTypeDto);
  }

  @MessagePattern({ cmd: 'findAllTransactionType' })
  findAll(@Payload() queryReq: QueryRequestDto) {
    return this.transactionTypeService.findAll(queryReq);
  }

  @MessagePattern({ cmd: 'findOneTransactionType' })
  findOne(@Payload() id: string) {
    return this.transactionTypeService.findOne(id);
  }

  @MessagePattern({ cmd: 'updateTransactionType' })
  update(@Payload() updateTransactionTypeDto: UpdateTransactionTypeDto) {
    return this.transactionTypeService.update(
      updateTransactionTypeDto._id,
      updateTransactionTypeDto,
    );
  }

  @MessagePattern({ cmd: 'removeTransactionType' })
  remove(@Payload() id: number) {
    return this.transactionTypeService.remove(id);
  }
}
