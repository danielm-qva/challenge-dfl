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
import { from, mergeMap, Observable } from 'rxjs';

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
      mergeMap((value) => {
        if (value) {
          throw new HttpException(
            'A similar transaction was already processed within the last 20 seconds. Please try again later',
            HttpStatus.BAD_REQUEST,
          );
        }
        return from(this.cacheService.set(payloadKey, '1', 20)).pipe(
          mergeMap(() => next.handle()),
        );
      }),
    );
  }
}
