import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { AdminDbService, AdminUserItem, ClientLeadItem } from "./admin-db.service";
import { AdminAuthService } from "./admin-auth.service";
import { AdminAuthGuard } from "./admin-auth.guard";
import type { AiConfigData, KnowledgeEntry } from "../chat/knowledge-base";

@Controller("admin")
export class AdminController {
  constructor(
    private readonly adminDb: AdminDbService,
    private readonly adminAuth: AdminAuthService,
  ) {}

  private extractClientIp(req: Request): string {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string" && forwarded.trim()) {
      return forwarded.split(",")[0].trim();
    }
    return req.ip || "127.0.0.1";
  }

  private requireRoles(req: Request, allowed: AdminUserItem["role"][]): AdminUserItem {
    const payload = (req as any).adminUser;
    const user = payload?.username
      ? this.adminDb.getUserByUsername(payload.username)
      : null;
    if (!user) {
      throw new UnauthorizedException("Sesión administrativa inválida");
    }
    if (!allowed.includes(user.role)) {
      throw new ForbiddenException(
        `El rol ${user.role} no tiene permisos para realizar esta acción`,
      );
    }
    return user;
  }

  @Post("shadow-verify")
  verifyShadowWord(@Body() body: { input?: string }) {
    const raw = (body?.input || "").trim();
    const parts = raw.split(/\s+/);
    const cmd = parts[0] || "";
    const sub = (parts[1] || "").toLowerCase();
    const match = this.adminAuth.isShadowWord(cmd);
    return {
      match,
      action: match && sub === "logout" ? "logout" : "login",
    };
  }

  @Post("login")
  login(
    @Body() body: { username?: string; password?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = this.adminDb.validateUserCredentials(
      body?.username || "",
      body?.password || "",
    );
    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const token = this.adminAuth.signToken({
      username: user.username,
      role: user.role,
    });

    res.setHeader(
      "Set-Cookie",
      `pidgeon_admin_token=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}`,
    );

    return {
      token,
      user,
    };
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) res: Response) {
    res.setHeader(
      "Set-Cookie",
      "pidgeon_admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
    );
    return { ok: true };
  }

  @Get("me")
  me(@Req() req: Request) {
    const payload = this.adminAuth.getAuthenticatedAdmin(req);
    if (!payload) {
      return { authenticated: false, user: null };
    }
    const user = this.adminDb.getUserByUsername(payload.username);
    return {
      authenticated: Boolean(user),
      user,
    };
  }

  @UseGuards(AdminAuthGuard)
  @Get("state")
  getState(@Req() req: Request) {
    const payload = (req as any).adminUser;
    const user = this.adminDb.getUserByUsername(payload.username);
    return {
      user,
      currentIp: this.extractClientIp(req),
      settings: this.adminDb.getSettings(),
      aiConfig: this.adminDb.getAiConfig(),
      memories: this.adminDb.getMemories(),
      shadowbans: this.adminDb.getShadowbans(),
      users: this.adminDb.getAllUsers(),
      clients: this.adminDb.getClients(),
    };
  }

  @UseGuards(AdminAuthGuard)
  @Put("settings")
  updateSettings(
    @Req() req: Request,
    @Body() body: { items?: { key: string; value: string }[] },
  ) {
    this.requireRoles(req, ["SUPERADMIN", "PARTNER"]);
    if (!Array.isArray(body?.items)) {
      throw new BadRequestException("Formato de settings inválido");
    }
    const settings = this.adminDb.updateSettings(body.items);
    return { settings };
  }

  @UseGuards(AdminAuthGuard)
  @Put("ai-config")
  updateAiConfig(@Req() req: Request, @Body() body: Partial<AiConfigData>) {
    this.requireRoles(req, ["SUPERADMIN", "PARTNER"]);
    const aiConfig = this.adminDb.updateAiConfig(body || {});
    return { aiConfig };
  }

  @UseGuards(AdminAuthGuard)
  @Post("memories")
  createOrUpdateMemory(@Req() req: Request, @Body() body: KnowledgeEntry) {
    this.requireRoles(req, ["SUPERADMIN", "PARTNER"]);
    if (!body?.slug || !body?.title || !body?.content) {
      throw new BadRequestException("Slug, título y contenido son obligatorios");
    }
    const memories = this.adminDb.upsertMemory(body);
    return { memories };
  }

  @UseGuards(AdminAuthGuard)
  @Put("memories/:slug")
  updateMemory(
    @Req() req: Request,
    @Param("slug") slug: string,
    @Body() body: Partial<KnowledgeEntry>,
  ) {
    this.requireRoles(req, ["SUPERADMIN", "PARTNER"]);
    if (!body?.title || !body?.content) {
      throw new BadRequestException("Título y contenido son obligatorios");
    }
    const memories = this.adminDb.upsertMemory({
      slug,
      title: body.title,
      content: body.content,
      keywords: body.keywords || [],
      priority: body.priority ?? 50,
      active: body.active !== false,
    });
    return { memories };
  }

  @UseGuards(AdminAuthGuard)
  @Delete("memories/:slug")
  deleteMemory(@Req() req: Request, @Param("slug") slug: string) {
    this.requireRoles(req, ["SUPERADMIN", "PARTNER"]);
    if (slug === "base") {
      throw new BadRequestException("La memoria base principal no puede eliminarse");
    }
    const memories = this.adminDb.deleteMemory(slug);
    return { memories };
  }

  @UseGuards(AdminAuthGuard)
  @Post("shadowbans")
  addShadowban(
    @Req() req: Request,
    @Body()
    body: {
      ip: string;
      reason?: string;
      fakeReplyEs?: string;
      fakeReplyEn?: string;
    },
  ) {
    this.requireRoles(req, ["SUPERADMIN", "PARTNER"]);
    if (!body?.ip?.trim()) {
      throw new BadRequestException("La IP es obligatoria");
    }
    const shadowbans = this.adminDb.upsertShadowban(body);
    return { shadowbans };
  }

  @UseGuards(AdminAuthGuard)
  @Delete("shadowbans/:ip")
  removeShadowban(@Req() req: Request, @Param("ip") ip: string) {
    this.requireRoles(req, ["SUPERADMIN", "PARTNER"]);
    const shadowbans = this.adminDb.removeShadowban(decodeURIComponent(ip));
    return { shadowbans };
  }

  // --- Etapa 3: Socios / Usuarios Internos (RBAC) ---
  @UseGuards(AdminAuthGuard)
  @Post("users")
  upsertUser(
    @Req() req: Request,
    @Body()
    body: {
      username: string;
      displayName: string;
      email: string;
      role?: AdminUserItem["role"];
      active?: boolean;
      password?: string;
    },
  ) {
    const actor = this.requireRoles(req, ["SUPERADMIN", "PARTNER"]);
    const targetUsername = (body?.username || "").trim().toLowerCase();
    if (!targetUsername) {
      throw new BadRequestException("El nombre de usuario es obligatorio");
    }

    // Si es PARTNER, solo puede editar sus propios datos/clave o crear SALES/VIEWER, nunca modificar a SUPERADMIN
    if (actor.role !== "SUPERADMIN") {
      if (targetUsername === "brianleft" || body.role === "SUPERADMIN") {
        throw new ForbiddenException(
          "Solo SUPERADMIN puede modificar cuentas con rol SUPERADMIN",
        );
      }
    }

    const users = this.adminDb.upsertUser(body);
    return { users };
  }

  @UseGuards(AdminAuthGuard)
  @Delete("users/:username")
  deleteUser(@Req() req: Request, @Param("username") username: string) {
    this.requireRoles(req, ["SUPERADMIN"]);
    const clean = decodeURIComponent(username || "").trim().toLowerCase();
    if (clean === "brianleft") {
      throw new BadRequestException("El usuario SUPERADMIN principal no puede eliminarse");
    }
    const users = this.adminDb.deleteUser(clean);
    return { users };
  }

  // --- Etapa 3: Catálogo de Clientes & Leads (Mini-CRM) ---
  @UseGuards(AdminAuthGuard)
  @Post("clients")
  createOrUpdateClient(
    @Req() req: Request,
    @Body()
    body: {
      id?: number;
      name: string;
      company?: string;
      email?: string;
      phone?: string;
      plan?: string;
      status?: ClientLeadItem["status"];
      notes?: string;
      assignedTo?: string;
      source?: string;
    },
  ) {
    this.requireRoles(req, ["SUPERADMIN", "PARTNER", "SALES"]);
    if (!body?.name?.trim()) {
      throw new BadRequestException("El nombre del cliente o lead es obligatorio");
    }
    const clients = this.adminDb.upsertClient(body);
    return { clients };
  }

  @UseGuards(AdminAuthGuard)
  @Put("clients/:id")
  updateClient(
    @Req() req: Request,
    @Param("id") id: string,
    @Body()
    body: {
      name: string;
      company?: string;
      email?: string;
      phone?: string;
      plan?: string;
      status?: ClientLeadItem["status"];
      notes?: string;
      assignedTo?: string;
      source?: string;
    },
  ) {
    this.requireRoles(req, ["SUPERADMIN", "PARTNER", "SALES"]);
    const numId = Number(id);
    if (!numId || !body?.name?.trim()) {
      throw new BadRequestException("ID y nombre del cliente son obligatorios");
    }
    const clients = this.adminDb.upsertClient({ ...body, id: numId });
    return { clients };
  }

  @UseGuards(AdminAuthGuard)
  @Delete("clients/:id")
  deleteClient(@Req() req: Request, @Param("id") id: string) {
    this.requireRoles(req, ["SUPERADMIN", "PARTNER"]);
    const clients = this.adminDb.deleteClient(Number(id));
    return { clients };
  }
}
