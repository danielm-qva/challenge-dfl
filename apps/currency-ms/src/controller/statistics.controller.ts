import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { QueryRequestDto } from '../../../challenge-dfl/src/dto';
import { StatisticsService } from '../services/statistics.service';

@Controller()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @MessagePattern({ cmd: 'reportStatistics' })
  create(@Payload() queryReq: QueryRequestDto) {
    return this.statisticsService.getReportStatistics();
  }
}
