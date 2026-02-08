import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { RsvpService } from './rsvp.service';
import { CreateRsvpDto } from './dto/create-rsvp.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('rsvp')
export class RsvpController {
  constructor(private readonly rsvpService: RsvpService) {}

  @Post()
  create(@Body() createRsvpDto: CreateRsvpDto) {
    return this.rsvpService.create(createRsvpDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    return this.rsvpService.findAll(+page, +limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats() {
    return this.rsvpService.getStats();
  }
}
