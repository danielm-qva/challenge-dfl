import { Injectable, NestMiddleware } from '@nestjs/common';
import { CreateTransactionDto } from '../../../currency-ms/src/dto/create-transaction.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { ERROR_CODE } from '../constant/Error.code';

@Injectable()
export class CurrencyMiddleware implements NestMiddleware {
  constructor(private readonly configServices: ConfigService) {}

  async use(req: any, res: Response, next: (error?: any) => void) {
    const body = req?.body as CreateTransactionDto;
    const listCurrency: any =
      await this.configServices.get('NEST_LIST_CURRENCY');
    if (!listCurrency.includes(body?.toCurrency)) {
      res.status(400).json({
        code: ERROR_CODE.INVALID_CURRENCY,
        message: `The currency ${body?.toCurrency} is not supported. Please use one of the supported currencies: ${listCurrency}`,
      });
    } else if (!listCurrency.includes(body?.fromCurrency)) {
      res.status(400).json({
        code: ERROR_CODE.INVALID_CURRENCY,
        message: `The currency ${body?.fromCurrency} is not supported. Please use one of the supported currencies: ${listCurrency}`,
      });
    }
    next();
  }
}
