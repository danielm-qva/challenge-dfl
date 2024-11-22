import { Controller, Get, Inject, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AppAuthGuards } from '../guards/app-auth.guards';

@Controller('currencies')
@UseGuards(AppAuthGuards)
export class CurrencyMsController {
  constructor(
    private readonly configServices: ConfigService,
    @Inject(CACHE_MANAGER) private cacheServices: Cache,
  ) {}

  @Get()
  async getListCurrency(@Res() response: Response) {
    const currency = this.configServices.get('NEST_LIST_CURRENCY');
    const dateMap: string[] = currency
      ?.split(',')
      .map((item: string) => item.trim());

    const listCurrency: string[] =
      await this.cacheServices.get('list-currencies');

    if (listCurrency && dateMap.length === listCurrency?.length) {
      return response.status(200).json({ supportedCurrencies: listCurrency });
    }
    await this.cacheServices.set('list-currencies', dateMap);
    return response.status(200).json({ supportedCurrencies: dateMap });
  }
}
