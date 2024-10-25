import { Module } from '@nestjs/common';
import { CurrencyMsController } from './controller/currency-ms.controller';
import { CurrencyMsService } from './services/currency-ms.service';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  controllers: [CurrencyMsController],
  providers: [CurrencyMsService],
})
export class AppMsModule {}
