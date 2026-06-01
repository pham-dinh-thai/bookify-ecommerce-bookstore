import { Test, TestingModule } from '@nestjs/testing';
import { StaffDashboardController } from './staff-dashboard.controller';
import { GetStaffDashboardUseCase } from '../../application/dashboard-use-cases/get-staff-dashboard/get-staff-dashboard.use-case';

describe('StaffDashboardController', () => {
  let controller: StaffDashboardController;
  const getStaffDashboardUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffDashboardController],
      providers: [
        {
          provide: GetStaffDashboardUseCase,
          useValue: getStaffDashboardUseCase,
        },
      ],
    }).compile();

    controller = module.get<StaffDashboardController>(StaffDashboardController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns the staff dashboard response', async () => {
    const response = { recentOrders: [], quickActions: [] };
    getStaffDashboardUseCase.execute.mockResolvedValue(response);

    await expect(controller.getDashboard()).resolves.toBe(response);
  });
});
