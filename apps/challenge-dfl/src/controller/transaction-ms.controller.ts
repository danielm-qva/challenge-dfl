import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateTransactionDto } from '../../../currency-ms/src/dto/create-transaction.dto';
import { CURRENCY_SERVICE } from '../config/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import { QueryRequestDto } from '../dto';
import { AppAuthGuards } from '../guards/app-auth.guards';
import { ParseObjectIdPipe } from '../pipe/parse-object-id.pipe';
import { RejectDuplicatePayloadInterceptor } from '../interceptor/reject-dupicate-payload.interceptor';

@Controller()
@UseGuards(AppAuthGuards)
export class TransactionController {
  constructor(
    @Inject(CURRENCY_SERVICE)
    private readonly clientCurrency: ClientProxy,
  ) {}

  @Post('/conversion')
  @UseInterceptors(RejectDuplicatePayloadInterceptor)
  async createConversion(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: any,
  ) {
    return this.clientCurrency.send(
      { cmd: 'createTransaction' },
      { ...createTransactionDto, userId: req?.user?.userID },
    );
  }

  @Get('/conversion')
  async getAllTransaction(@Query() query: QueryRequestDto) {
    return this.clientCurrency.send({ cmd: 'findAllTransaction' }, query);
  }

  @Get('/conversion/:id')
  async getOneTransaction(@Param('id', ParseObjectIdPipe) _id: string) {
    return this.clientCurrency.send({ cmd: 'findOneTransaction' }, { _id });
  }
}
