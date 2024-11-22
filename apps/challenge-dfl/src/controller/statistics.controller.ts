import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { CURRENCY_SERVICE } from '../config/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import { AppAuthGuards } from '../guards/app-auth.guards';

@Controller('statistics')
@UseGuards(AppAuthGuards)
export class StatisticsController {
  constructor(
    @Inject(CURRENCY_SERVICE)
    private readonly clientCurrency: ClientProxy,
  ) {}

  @Get()
  async getReportStatistics() {
    return this.clientCurrency.send({ cmd: 'reportStatistics' }, {});
  }
}
