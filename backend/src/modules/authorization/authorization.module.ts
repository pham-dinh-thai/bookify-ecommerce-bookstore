import { Module } from '@nestjs/common';
import { RolesModule } from './roles.module';
import { PermissionsModule } from './permissions.module';

@Module({
  imports: [RolesModule, PermissionsModule],
})
export class AuthorizationModule {}
