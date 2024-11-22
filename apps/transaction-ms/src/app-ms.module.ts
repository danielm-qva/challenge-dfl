import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { TransactionTypeModule } from './modules/transaction-type.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TransactionTypeModule,
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
