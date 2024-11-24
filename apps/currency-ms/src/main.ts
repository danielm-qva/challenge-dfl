import { NestFactory } from '@nestjs/core';
import { AppMsModule } from './app-ms.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RpcCustomExceptionFilter } from '../../challenge-dfl/src/exceptions/rpc-custom-exception.filter';
import { JobService } from './services/Job.service';
import { AssignCodeService } from './services/AssignCode.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppMsModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.NEST_HOST_CURRENCY || 'localhost',
        port: Number(process.env.NEST_PORT_MS_CURRENCY) || 3001,
      },
    },
  );
  const job = app.get(JobService);
  const assignCode = app.get(AssignCodeService);
  await job.updateCurrency();
  await assignCode.setUpStartDay();
  app.useGlobalFilters(new RpcCustomExceptionFilter());
  await app.listen();
}

bootstrap();
