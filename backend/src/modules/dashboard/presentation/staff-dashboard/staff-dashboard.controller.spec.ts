import { Test, TestingModule } from '@nestjs/testing';
import { StaffDashboardController } from './staff-dashboard.controller';

describe('StaffDashboardController', () => {
  let controller: StaffDashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffDashboardController],
    }).compile();

    controller = module.get<StaffDashboardController>(StaffDashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
