import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import { ExchangeRate } from '../utils/ExhangeRate';

@Injectable()
export class JobService {
  private exchangeRate: ExchangeRate;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {
    const baseCurrency = this.configService.get<string>('NEST_BASE_CURRENCY');
    const currencyList = this.configService
      .get<string>('NEST_LIST_CURRENCY')
      .split(',');
    this.exchangeRate = new ExchangeRate(baseCurrency, {}, currencyList);
  }

  @Cron('0 0 */2 * * *', { name: 'JobExchangeCurrency' })
  async updateCurrency() {
    try {
      const baseUrl = `${this.configService.get('NEST_BASE_URL_EXCHANGE_API')}/?base=${this.configService.get('NEST_BASE_CURRENCY')}`;
      const response = await firstValueFrom(this.httpService.get(baseUrl));
      const data = response.data;
      this.exchangeRate.updateRates(data.base, data.rates);
    } catch (error) {
      console.error('Error al actualizar las tasas de cambio:', error.message);
    }
  }

  getExchangeRate(
    fromCurrency: string,
    toCurrency: string,
  ): number | undefined {
    return this.exchangeRate.getRate(fromCurrency, toCurrency);
  }
}
