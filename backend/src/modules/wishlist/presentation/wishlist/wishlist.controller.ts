import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../shared/http/guards/jwt-auth.guard';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {}
