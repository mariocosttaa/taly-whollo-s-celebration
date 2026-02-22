import { Test, TestingModule } from '@nestjs/testing';
import { RsvpService } from './rsvp.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RsvpService', () => {
  let service: RsvpService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RsvpService,
        {
          provide: PrismaService,
          useValue: {
            rsvp: {
              create: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<RsvpService>(RsvpService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an RSVP', async () => {
      const dto = {
        name: 'Maria',
        email: 'maria@test.com',
        attendance: 'confirmed',
        message: 'Obrigada!',
      };
      (prisma.rsvp.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...dto,
        createdAt: new Date(),
      });

      const result = await service.create(dto);

      expect(prisma.rsvp.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('name', 'Maria');
      expect(result).toHaveProperty('attendance', 'confirmed');
    });
  });

  describe('findAll', () => {
    it('should return paginated data and total', async () => {
      (prisma.rsvp.findMany as jest.Mock).mockResolvedValue([
        { id: 1, name: 'A', attendance: 'confirmed' },
      ]);
      (prisma.rsvp.count as jest.Mock).mockResolvedValue(1);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: [{ id: 1, name: 'A', attendance: 'confirmed' }],
        total: 1,
      });
      expect(prisma.rsvp.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
          orderBy: { createdAt: 'desc' },
        }),
      );
    });
  });

  describe('getStats', () => {
    it('should return total, confirmed and declined counts', async () => {
      (prisma.rsvp.count as jest.Mock)
        .mockResolvedValueOnce(20)
        .mockResolvedValueOnce(15)
        .mockResolvedValueOnce(5);

      const result = await service.getStats();

      expect(result).toEqual({ total: 20, confirmed: 15, declined: 5 });
      expect(prisma.rsvp.count).toHaveBeenCalledTimes(3);
    });
  });
});
