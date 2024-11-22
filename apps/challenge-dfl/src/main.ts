import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './exceptions/rpc-custom-exception.filter';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new RpcCustomExceptionFilter());
  const port = Number(process.env.NEST_PORT_GATEWAY) || 3000;
  await app.listen(port, async () => {
    const cacheManager = app.get<Cache>(CACHE_MANAGER);
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const redisServerStart = await cacheManager.get('SERVER_DAY_START');
    if (!redisServerStart) {
      await cacheManager.set('SERVER_DAY_START', date.toISOString());
    }
    console.log('Server Running...', port);
  });
}

bootstrap();
