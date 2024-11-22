import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CurrencyMsController } from '../controller/currency-ms.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CURRENCY_SERVICE } from '../config/services.constant';
import { TransactionController } from '../controller/transaction-ms.controller';
import { CurrencyMiddleware } from '../middleware/currency.middleware';
import { StatisticsController } from '../controller/statistics.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: process.env.NEST_HOST_CURRENCY || CURRENCY_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.NEST_HOST_CURRENCY || 'localhost',
          port: Number(process.env.NEST_PORT_MS_CURRENCY) || 3001,
        },
      },
    ]),
  ],
  controllers: [
    CurrencyMsController,
    TransactionController,
    StatisticsController,
  ],
})
export class CurrencyMsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(CurrencyMiddleware)
      .forRoutes({ path: 'conversion', method: RequestMethod.POST });
  }
}
