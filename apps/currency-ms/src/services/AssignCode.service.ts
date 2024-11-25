import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Cron } from '@nestjs/schedule';
import { TransactionService } from './transaction.service';
import { AvailabilityCode, fillZero } from '../utils/generateCode';

@Injectable()
export class AssignCodeService implements OnModuleInit {
  private date: Date = new Date();
  private size = 1e6 + 2;
  private Codes = new AvailabilityCode();

  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @Inject(forwardRef(() => TransactionService))
    private TransactionService: TransactionService,
  ) {}

  async onModuleInit() {
    try {
      const lastRecord = await this.TransactionService.getLastRecord();
      const initValue = lastRecord?.transactionCode?.slice(-8);
      if (initValue) {
        for (let i = parseInt(initValue, 10) + 1; i <= this.size; i++) {
          this.Codes.insert(fillZero(i, 8), false);
        }
      } else {
        await this.resetAndInitializeServer();
      }
    } catch (error) {
      console.error('Error al obtener el último registro:', error.message);
    }
  }

  private async resetAndInitializeServer() {
    this.Codes = new AvailabilityCode();
    for (let i = 1; i <= this.size; i++) {
      this.Codes.insert(fillZero(i, 8), false);
    }
  }

  @Cron('* 1 0 * * *', { name: 'updateDayStart' })
  async setUpStartDay() {
    const today = this.getFormattedDate(new Date());
    const lastExecution =
      await this.cacheService.get<string>('SERVER_DAY_START');
    if (lastExecution !== today) {
      await this.cacheService.set('SERVER_DAY_START', today);
      await this.resetAndInitializeServer();
    }
  }

  update(code: string, availability: boolean) {
    this.Codes.update(code, availability);
  }

  get(code: string) {
    return this.Codes.get(code);
  }

  getFirstAvailableCode() {
    const code = this.Codes.getFirstAvailableCode();
    return {
      codeFinal: `T${this.date.getFullYear()}${this.date.getMonth() + 1}${this.date.getDay()}${this.date.getHours()}${code}`,
      code,
    };
  }

  delete(code: string) {
    this.Codes.delete(code);
  }

  private getFormattedDate(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
  }
}
