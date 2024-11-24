import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './exceptions/rpc-custom-exception.filter';

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
    console.log('Server Running...', port);
  });
}

bootstrap();
