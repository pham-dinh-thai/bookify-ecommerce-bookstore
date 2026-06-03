import { Module } from '@nestjs/common';
import { EmailModule } from './presentation/email/email.module';

@Module({
  imports: [EmailModule]
})
export class EmailModule {}
