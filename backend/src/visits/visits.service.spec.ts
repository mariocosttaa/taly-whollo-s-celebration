import { Test, TestingModule } from '@nestjs/testing';
import { VisitsService } from './visits.service';
import { PrismaService } from '../prisma/prisma.service';

describe('VisitsService', () => {
  let service: VisitsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VisitsService,
        {
          provide: PrismaService,
          useValue: {
            visit: {
              create: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<VisitsService>(VisitsService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a visit with page and optional name', async () => {
      const dto = { page: 'home', name: 'Guest' };
      (prisma.visit.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...dto,
        timestamp: new Date(),
      });

      const result = await service.create(dto);

      expect(prisma.visit.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('page', 'home');
      expect(result).toHaveProperty('name', 'Guest');
    });
  });

  describe('getStats', () => {
    it('should return totalVisits and last24h', async () => {
      (prisma.visit.count as jest.Mock)
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(5);

      const result = await service.getStats();

      expect(result).toEqual({ totalVisits: 100, last24h: 5 });
      expect(prisma.visit.count).toHaveBeenCalledTimes(2);
    });
  });

  describe('getLast7Days', () => {
    it('should return 7 days with counts', async () => {
      (prisma.visit.count as jest.Mock).mockImplementation(() => Promise.resolve(2));

      const result = await service.getLast7Days();

      expect(result).toHaveLength(7);
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('count', 2);
      expect(prisma.visit.count).toHaveBeenCalledTimes(7);
    });
  });
});
