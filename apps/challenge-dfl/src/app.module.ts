import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { CurrencyMsModule } from './modules/currency-ms.module';
import { TransactionTypeMsModule } from './modules/transaction-type-ms.module';
import { JwtModule } from '@nestjs/jwt';
import { AppAuthGuards } from './guards/app-auth.guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.APP_JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.NEST_HOST_REDIS,
      port: process.env.NEST_PORT_REDIS,
    }),
    ScheduleModule.forRoot(),
    CurrencyMsModule,
    TransactionTypeMsModule,
  ],
  controllers: [],
  providers: [AppAuthGuards],
  exports: [],
})
export class AppModule {}
