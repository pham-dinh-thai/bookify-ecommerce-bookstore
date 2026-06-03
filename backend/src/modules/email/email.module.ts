import { Module } from '@nestjs/common';
import { EmailController } from './presentation/email/email.controller';

@Module({
  imports: [],
  controllers: [EmailController],
})
export class EmailModule {}
