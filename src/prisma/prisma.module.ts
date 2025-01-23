import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// The @Global() decorator makes this module available globally in the application
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
