import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";
import type { Request } from "express";

export interface AdminTokenPayload {
  username: string;
  role: string;
  exp: number;
}

@Injectable()
export class AdminAuthService {
  private get secret(): string {
    return (
      process.env.ADMIN_TOKEN_SECRET ||
      "pidgeon-shadow-backoffice-secret-2026-x9k2m7q4"
    );
  }

  public isShadowWord(input: string): boolean {
    const clean = (input || "").trim().toLowerCase();
    if (!clean) return false;
    const configured = (process.env.ADMIN_SHADOW_WORD || "/shadow")
      .trim()
      .toLowerCase();
    const configuredNoSlash = configured.replace(/^\//, "");
    return (
      clean === configured ||
      clean === `/${configuredNoSlash}` ||
      clean === configuredNoSlash ||
      clean === "/admin"
    );
  }

  public signToken(payload: { username: string; role: string }): string {
    const fullPayload: AdminTokenPayload = {
      username: payload.username,
      role: payload.role,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 días
    };
    const data = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
    const sig = crypto
      .createHmac("sha256", this.secret)
      .update(data)
      .digest("base64url");
    return `${data}.${sig}`;
  }

  public verifyToken(token?: string): AdminTokenPayload | null {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [data, sig] = parts;
    const expectedSig = crypto
      .createHmac("sha256", this.secret)
      .update(data)
      .digest("base64url");

    try {
      const valid = crypto.timingSafeEqual(
        Buffer.from(sig),
        Buffer.from(expectedSig),
      );
      if (!valid) return null;
      const decoded = JSON.parse(
        Buffer.from(data, "base64url").toString("utf8"),
      ) as AdminTokenPayload;
      if (!decoded.exp || decoded.exp < Date.now()) return null;
      return decoded;
    } catch {
      return null;
    }
  }

  public extractTokenFromRequest(req: Request): string | undefined {
    const authHeader = req.headers["authorization"];
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      return authHeader.slice(7).trim();
    }
    const adminHeader = req.headers["x-admin-token"];
    if (typeof adminHeader === "string" && adminHeader.trim()) {
      return adminHeader.trim();
    }
    const cookieHeader = req.headers["cookie"];
    if (typeof cookieHeader === "string") {
      const match = cookieHeader.match(/pidgeon_admin_token=([^;]+)/);
      if (match?.[1]) return decodeURIComponent(match[1].trim());
    }
    return undefined;
  }

  public getAuthenticatedAdmin(req: Request): AdminTokenPayload | null {
    const token = this.extractTokenFromRequest(req);
    return this.verifyToken(token);
  }
}
