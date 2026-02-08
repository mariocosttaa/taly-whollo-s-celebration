import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { RsvpModule } from './rsvp/rsvp.module';
import { VisitsModule } from './visits/visits.module';

@Module({
  imports: [PrismaModule, AuthModule, RsvpModule, VisitsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
