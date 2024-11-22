import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { from, Observable, switchMap } from 'rxjs';

@Injectable()
export class RejectDuplicatePayloadInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { fromCurrency, toCurrency, amount } = request.body;
    const payloadKey = `${fromCurrency}-${toCurrency}-${amount}`;

    return from(this.cacheService.get(payloadKey)).pipe(
      switchMap(async (value) => {
        if (value) {
          throw new HttpException(
            'A similar transaction was already processed within the last 20 seconds. Please try again later',
            HttpStatus.BAD_REQUEST,
          );
        }
        await this.cacheService.set(payloadKey, '1', 20);
        return next.handle();
      }),
    );
  }
}
