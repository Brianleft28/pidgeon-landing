import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
import { AdminDbService } from "./admin-db.service";
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
  updateSettings(@Body() body: { items?: { key: string; value: string }[] }) {
    if (!Array.isArray(body?.items)) {
      throw new BadRequestException("Formato de settings inválido");
    }
    const settings = this.adminDb.updateSettings(body.items);
    return { settings };
  }

  @UseGuards(AdminAuthGuard)
  @Put("ai-config")
  updateAiConfig(@Body() body: Partial<AiConfigData>) {
    const aiConfig = this.adminDb.updateAiConfig(body || {});
    return { aiConfig };
  }

  @UseGuards(AdminAuthGuard)
  @Post("memories")
  createOrUpdateMemory(@Body() body: KnowledgeEntry) {
    if (!body?.slug || !body?.title || !body?.content) {
      throw new BadRequestException("Slug, título y contenido son obligatorios");
    }
    const memories = this.adminDb.upsertMemory(body);
    return { memories };
  }

  @UseGuards(AdminAuthGuard)
  @Put("memories/:slug")
  updateMemory(
    @Param("slug") slug: string,
    @Body() body: Partial<KnowledgeEntry>,
  ) {
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
  deleteMemory(@Param("slug") slug: string) {
    if (slug === "base") {
      throw new BadRequestException("La memoria base principal no puede eliminarse");
    }
    const memories = this.adminDb.deleteMemory(slug);
    return { memories };
  }

  @UseGuards(AdminAuthGuard)
  @Post("shadowbans")
  addShadowban(
    @Body()
    body: {
      ip: string;
      reason?: string;
      fakeReplyEs?: string;
      fakeReplyEn?: string;
    },
  ) {
    if (!body?.ip?.trim()) {
      throw new BadRequestException("La IP es obligatoria");
    }
    const shadowbans = this.adminDb.upsertShadowban(body);
    return { shadowbans };
  }

  @UseGuards(AdminAuthGuard)
  @Delete("shadowbans/:ip")
  removeShadowban(@Param("ip") ip: string) {
    const shadowbans = this.adminDb.removeShadowban(decodeURIComponent(ip));
    return { shadowbans };
  }
}
