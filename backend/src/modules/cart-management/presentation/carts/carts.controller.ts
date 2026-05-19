import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../../shared/http/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';

@Controller('carts')
@UseGuards(JwtAuthGuard)
export class CartsController {
  @Get()
  public findAllItem(@CurrentUser('userId') userId: string) {}

  @Post()
  public addItem(@CurrentUser('userId') userId: string) {}

  @Delete(':itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public removeItem(@CurrentUser('userId') userId: string) {}
}
