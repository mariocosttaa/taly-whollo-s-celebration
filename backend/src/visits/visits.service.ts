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

  async findAll(page: number = 1, limit: number = 20, search?: string) {
    const skip = (page - 1) * limit;
    const take = Math.min(Math.max(limit, 1), 100);

    const term = search?.trim();
    const where = term
      ? {
          OR: [
            { page: { contains: term } },
            { ip: { contains: term } },
          ],
        }
      : undefined;

    const [data, total] = await Promise.all([
      this.prisma.visit.findMany({
        where,
        skip,
        take,
        orderBy: { timestamp: 'desc' },
        select: { id: true, timestamp: true, page: true, ip: true, userAgent: true },
      }),
      this.prisma.visit.count({ where }),
    ]);

    return { data, total };
  }

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

  /** Últimos 7 dias de acessos (para gráficos) */
  async getLast7Days() {
    const days: { date: string; count: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      const count = await this.prisma.visit.count({
        where: {
          timestamp: { gte: d, lt: next },
        },
      });
      days.push({
        date: d.toISOString().slice(0, 10),
        count,
      });
    }
    return days;
  }
}
