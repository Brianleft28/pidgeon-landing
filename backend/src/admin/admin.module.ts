import { Global, Module } from "@nestjs/common";
import { AdminDbService } from "./admin-db.service";
import { AdminAuthService } from "./admin-auth.service";
import { AdminAuthGuard } from "./admin-auth.guard";
import { AdminController } from "./admin.controller";

@Global()
@Module({
  controllers: [AdminController],
  providers: [AdminDbService, AdminAuthService, AdminAuthGuard],
  exports: [AdminDbService, AdminAuthService, AdminAuthGuard],
})
export class AdminModule {}
