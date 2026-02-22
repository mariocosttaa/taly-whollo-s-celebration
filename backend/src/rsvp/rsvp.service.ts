import { Injectable } from '@nestjs/common';
import { CreateRsvpDto } from './dto/create-rsvp.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RsvpService {
  constructor(private prisma: PrismaService) {}

  create(createRsvpDto: CreateRsvpDto) {
    return this.prisma.rsvp.create({
      data: createRsvpDto,
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    attendance?: string,
  ) {
    const skip = (page - 1) * limit;
    const take = Math.min(Math.max(limit, 1), 100);
    const term = search?.trim();
    const statusFilter =
      attendance === 'confirmed' || attendance === 'declined'
        ? { attendance }
        : undefined;
    const searchClause = term
      ? {
          OR: [
            { name: { contains: term } },
            { email: { contains: term } },
            { attendance: { contains: term } },
          ],
        }
      : undefined;
    const where =
      statusFilter && searchClause
        ? { AND: [statusFilter, searchClause] }
        : statusFilter || searchClause;

    const [data, total] = await Promise.all([
      this.prisma.rsvp.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.rsvp.count({ where }),
    ]);
    return { data, total };
  }
  
  async getStats() {
    const total = await this.prisma.rsvp.count();
    const confirmed = await this.prisma.rsvp.count({
      where: { attendance: 'confirmed' },
    });
    const declined = await this.prisma.rsvp.count({
      where: { attendance: 'declined' },
    });
    return { total, confirmed, declined };
  }
}
