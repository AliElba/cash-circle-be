import { Module } from '@nestjs/common';
import { CirclesService } from './circles.service';
import { CirclesController } from './circles.controller';

@Module({
  providers: [CirclesService],
  controllers: [CirclesController],
})
export class CirclesModule {}
