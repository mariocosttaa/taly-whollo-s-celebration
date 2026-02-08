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

  findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.prisma.rsvp.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
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
