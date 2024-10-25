import { Module } from '@nestjs/common';
import { CurrencyMsController } from '../controller/currency-ms.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CURRENCY_SERVICE } from '../config/services';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: CURRENCY_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [CurrencyMsController],
})
export class CurrencyMsModule {}
