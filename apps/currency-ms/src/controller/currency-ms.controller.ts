import { Controller, Res } from '@nestjs/common';
import { CurrencyMsService } from '../services/currency-ms.service';
import { Response } from 'express';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class CurrencyMsController {
  constructor(private readonly currencyMsService: CurrencyMsService) {}

  @MessagePattern({ cmd: 'get_list_currencies' })
  async handleListCurrencies(@Res() response: Response) {
    return this.currencyMsService.getAvailableCurrencies();
  }
}
