import { NestFactory } from '@nestjs/core';
import { AppMsModule } from './app-ms.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { JobService } from './services/Job.service';
import { RpcCustomExceptionFilter } from '../../challenge-dfl/src/exceptions/rpc-custom-exception.filter';
import { AssignCodeService } from './services/AssignCode.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppMsModule,
    {
      transport: Transport.TCP,
      options: {
        port: Number(process.env.NEST_PORT_MS_CURRENCY) || 3001,
        retryAttempts: 3,
        retryDelay: 3000,
      },
    },
  );
  const job = app.get(JobService);
  const assignCode = app.get(AssignCodeService);
  await job.updateCurrency();
  await assignCode.setUpStartDay();
  await assignCode.checkDayChange();
  app.useGlobalFilters(new RpcCustomExceptionFilter());
  await app.listen();
}

bootstrap();
