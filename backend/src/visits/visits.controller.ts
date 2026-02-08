import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  create(@Body() createVisitDto: CreateVisitDto, @Req() req: Request) {
    // Enrich with IP and User Agent if not provided
    if (!createVisitDto.ip) createVisitDto.ip = req.ip;
    if (!createVisitDto.userAgent) createVisitDto.userAgent = req.headers['user-agent'];
    return this.visitsService.create(createVisitDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.visitsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats() {
    return this.visitsService.getStats();
  }
}
