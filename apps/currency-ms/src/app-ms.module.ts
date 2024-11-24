import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { TransactionModule } from './modules/transaction.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TransactionModule,
    HttpModule,
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.NEST_HOST_REDIS,
      port: process.env.NEST_PORT_REDIS,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppMsModule {}
