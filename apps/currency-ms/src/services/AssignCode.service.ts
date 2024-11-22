import { Inject, Injectable } from '@nestjs/common';
import { AvailabilityCode, fillZero } from '../utils/GenerateCode';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AssignCodeService {
  private date: Date = new Date();
  private size = 1e6 + 2;
  private Codes = new AvailabilityCode();

  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {
    this.init().then();
  }

  async init() {
    const date = new Date();
    const dayCacheStart =
      await this.cacheService.get<string>('SERVER_DAY_START');
    console.log('dayCacheStart', dayCacheStart);
    if (!dayCacheStart) {
      await this.initializeServer(date);
    } else {
      const dayStart = new Date(dayCacheStart);
      if (
        dayStart.getDate() !== date.getDate() ||
        dayStart.getMonth() !== date.getMonth() ||
        dayStart.getFullYear() !== date.getFullYear()
      ) {
        await this.resetAndInitializeServer(date);
      }
    }
  }

  private async initializeServer(date: Date) {
    for (let i = 1; i <= this.size; i++) {
      this.Codes.insert(fillZero(i, 8), false);
    }
    await this.cacheService.set('SERVER_DAY_START', date.toISOString());
  }

  private async resetAndInitializeServer(date: Date) {
    this.Codes = new AvailabilityCode();

    for (let i = 1; i <= this.size; i++) {
      this.Codes.insert(fillZero(i, 8), false);
    }
    await this.cacheService.set('SERVER_DAY_START', date.toISOString());
  }

  @Cron('* 1 0 * * *', { name: 'updateDayStart' })
  async setUpStartDay() {
    const date = new Date();
    await this.cacheService.set('SERVER_DAY_START', date.toISOString());
  }

  @Cron('* * * * *', { name: 'checkDayChange' })
  async checkDayChange() {
    const date = new Date();
    const dayCacheStart =
      await this.cacheService.get<string>('SERVER_DAY_START');

    if (!dayCacheStart) return;

    const dayStart = new Date(dayCacheStart);
    if (
      dayStart.getDate() !== date.getDate() ||
      dayStart.getMonth() !== date.getMonth() ||
      dayStart.getFullYear() !== date.getFullYear()
    ) {
      await this.resetAndInitializeServer(date);
    }
  }

  insert(code: string, availability: boolean) {
    this.Codes.insert(code, availability);
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
      codeFinal: `T${this.date.getFullYear()}${this.date.getMonth()}${this.date.getDate()}${this.date.getHours()}${this.date.getMinutes()}${code}`,
      code,
    };
  }

  delete(code: string) {
    this.Codes.delete(code);
  }
}
