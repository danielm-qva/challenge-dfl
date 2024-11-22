import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ERROR_CODE } from '../constant/Error.code';

@Injectable()
export class RequestEqualsMiddlewareMiddleware implements NestMiddleware {
  constructor(@Inject(CACHE_MANAGER) private cacheServices: Cache) {}

  async use(
    req: Request,
    res: Response,
    next: (error?: any) => void,
  ): Promise<any> {
    const sizeBody = req?.headers?.['content-length'];
    const timeRequest = new Date();
    const timeRequestRedis = await this.cacheServices.get('timeRequest');
    const sizeBodyRedis = await this.cacheServices.get('content-length');

    if (timeRequestRedis && sizeBodyRedis) {
      if (
        sizeBodyRedis === sizeBody &&
        solveMinute(new Date(timeRequestRedis as Date), timeRequest)
      ) {
        return res.status(400).json({
          code: ERROR_CODE.DUPLICATED_TRANSACTION,
          message:
            'A similar transaction was already processed within the last 20 seconds. Please try again later.',
        });
      }
      await this.cacheServices.set('timeRequest', timeRequest);
      await this.cacheServices.set('content-length', sizeBody);
      next();
    } else {
      await this.cacheServices.set('timeRequest', timeRequest);
      await this.cacheServices.set('content-length', sizeBody);
      next();
    }
  }
}

const solveMinute = (startDate: Date, endDate: Date) => {
  const minutStartDate = startDate.getMinutes() * 60; // seconds
  const hourstStartDate = startDate.getHours() * 3600; // seconds
  const secondStartDate = startDate.getSeconds();
  const totalStartDate = minutStartDate + hourstStartDate + secondStartDate;

  const minutendDate = endDate.getMinutes() * 60;
  const hourstendDate = endDate.getHours() * 3600;
  const secondendDate = endDate.getSeconds();
  const totalSecondsEnd = minutendDate + hourstendDate + secondendDate;

  return Math.abs(totalStartDate - totalSecondsEnd) < 20;
};
