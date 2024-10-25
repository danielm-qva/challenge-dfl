import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JobService } from './services/Job.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const job = app.get(JobService);
  await job.schedulerTest();
  await app.listen(process.env.NEST_PORT_CLIENT_GATEWAY ?? 3000);
}

bootstrap();
