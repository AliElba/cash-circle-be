import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CircleModule } from './circle/circle.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UserModule, CircleModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
