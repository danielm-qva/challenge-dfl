import { NestFactory } from '@nestjs/core';
import { AppMsModule } from './app-ms.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RpcCustomExceptionFilter } from '../../challenge-dfl/src/exceptions/rpc-custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppMsModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.NEST_HOST_TRANSACTION || 'localhost',
        port: Number(process.env.NEST_PORT_MS_CURRENCY) || 3002,
      },
    },
  );
  app.useGlobalFilters(new RpcCustomExceptionFilter());
  await app.listen();
}

bootstrap();
