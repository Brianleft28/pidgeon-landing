import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AdminAuthService } from "./admin-auth.service";

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly authService: AdminAuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const admin = this.authService.getAuthenticatedAdmin(req);
    if (!admin) {
      throw new UnauthorizedException("Sesión de Backoffice inválida o expirada");
    }
    req.adminUser = admin;
    return true;
  }
}
