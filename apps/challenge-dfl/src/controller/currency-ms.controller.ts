import { Controller, Get, Inject } from '@nestjs/common';
import { CURRENCY_SERVICE } from '../config/services';
import { ClientProxy } from '@nestjs/microservices';

@Controller('currencies')
export class CurrencyMsController {
  constructor(@Inject(CURRENCY_SERVICE) private clientCurrency: ClientProxy) {}

  @Get()
  getListCurrency() {
    return this.clientCurrency.send({ cmd: 'get_list_currencies' }, {});
  }
}
