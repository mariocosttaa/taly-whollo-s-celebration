import { Injectable } from '@nestjs/common';
import { CreateVisitDto } from './dto/create-visit.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VisitsService {
  constructor(private prisma: PrismaService) {}

  create(createVisitDto: CreateVisitDto) {
    return this.prisma.visit.create({
      data: createVisitDto,
    });
  }

  findAll() {
    return this.prisma.visit.findMany({
      orderBy: { timestamp: 'desc' },
    });
  }

  // Helper for stats
  async getStats() {
    const totalVisits = await this.prisma.visit.count();
    const last24h = await this.prisma.visit.count({
      where: {
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });
    return { totalVisits, last24h };
  }
}
