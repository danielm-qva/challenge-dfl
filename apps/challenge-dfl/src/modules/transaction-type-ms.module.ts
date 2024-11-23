import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TRANSACTION_TYPE_SERVICE } from '../config/services.constant';
import { TransactionTypeMsController } from '../controller/transaction-type-ms.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: TRANSACTION_TYPE_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.NEST_HOST_TRANSACTION || 'localhost',
          port: Number(process.env.NEST_PORT_MS_TRANSACTION) || 3002,
        },
      },
    ]),
  ],
  controllers: [TransactionTypeMsController],
})
export class TransactionTypeMsModule {}
