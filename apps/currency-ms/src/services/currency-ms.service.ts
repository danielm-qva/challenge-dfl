import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

@Injectable()
export class CurrencyMsService {
  constructor(
    private readonly configServices: ConfigService,
    @Inject(CACHE_MANAGER) private cacheServices: Cache,
  ) {}

  async getAvailableCurrencies(): Promise<any> {
    const dataCache = await this.cacheServices.get('list-currencies');
    if (dataCache) {
      return dataCache;
    }
    const currency = this.configServices.get('NEST_LIST_CURRENCY');
    const dateMap = currency?.split(',').map((item: string) => item.trim());
    await this.cacheServices.set('list-currencies', dateMap);
    return dateMap;
  }
}
