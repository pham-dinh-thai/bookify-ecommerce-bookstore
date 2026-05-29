import { Controller, Get } from '@nestjs/common';

@Controller('orders')
export class OrderManagementController {
  @Get()
  public async findAll() {}

  @Get(':id')
  public async findOne() {}
}
