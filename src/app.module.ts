import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CirclesModule } from './circles/circles.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule, CirclesModule, PrismaModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
