import { Test, TestingModule } from '@nestjs/testing';
import { AdminDashboardController } from './admin-dashboard.controller';
import { GetAdminDashboardUseCase } from '../../application/dashboard-use-cases/get-admin-dashboard/get-admin-dashboard.use-case';

describe('AdminDashboardController', () => {
  let controller: AdminDashboardController;
  const getAdminDashboardUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminDashboardController],
      providers: [
        {
          provide: GetAdminDashboardUseCase,
          useValue: getAdminDashboardUseCase,
        },
      ],
    }).compile();

    controller = module.get<AdminDashboardController>(AdminDashboardController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns the admin dashboard response', async () => {
    const response = { systemTotals: {}, recentActivities: [] };
    getAdminDashboardUseCase.execute.mockResolvedValue(response);

    await expect(controller.getDashboard()).resolves.toBe(response);
  });
});
