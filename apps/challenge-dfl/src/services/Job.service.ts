import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JobService {
  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  @Cron('10 * * * * ', { name: 'JobExchangeCurrency' })
  async schedulerTest() {
    const baseUrl = `${this.configService.get('NEST_BASE_URL_EXCHANGE_API')}/${this.configService.get('NEST_API_KEY_EXCHANGE_API')}/latest/${this.configService.get('NEST_BASE_CURRENCY')}`;
    const response = await firstValueFrom(this.httpService.get(baseUrl));
    await this.cacheService.set('list-currencies', response.data);
  }
}
