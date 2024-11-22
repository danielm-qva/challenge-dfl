import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class ParseObjectIdPipe
  implements PipeTransform<any, mongoose.Types.ObjectId>
{
  transform(value: any): mongoose.Types.ObjectId {
    const objectId: boolean = mongoose.isObjectIdOrHexString(value);
    if (!objectId) {
      throw new BadRequestException('ObjectId not valid');
    }
    return value;
  }
}
