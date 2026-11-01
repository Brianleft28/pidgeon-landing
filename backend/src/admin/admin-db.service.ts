import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import {
  AiConfigData,
  DEFAULT_AI_CONFIG,
  DEFAULT_SETTINGS,
  KNOWLEDGE_ENTRIES,
  KnowledgeEntry,
  SettingItem,
} from "../chat/knowledge-base";

export interface ShadowbanItem {
  ip: string;
  reason: string;
  fakeReplyEs: string;
  fakeReplyEn: string;
  createdAt: string;
}

export interface AdminUserItem {
  id: number;
  username: string;
  displayName: string;
  email: string;
  role: "SUPERADMIN" | "PARTNER" | "SALES" | "VIEWER";
  active: boolean;
  createdAt: string;
}

export interface ClientLeadItem {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  plan: string;
  status: "LEAD" | "CONTACTED" | "DEMO" | "ACTIVE" | "PAUSED";
  notes: string;
  assignedTo: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class AdminDbService implements OnModuleInit {
  private readonly logger = new Logger(AdminDbService.name);
  private db: any;

  onModuleInit() {
    const dbPath =
      process.env.SQLITE_DB_PATH ||
      path.join(process.cwd(), "data", "pidgeon.sqlite");
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { DatabaseSync } = require("node:sqlite");
    this.db = new DatabaseSync(dbPath);
    this.db.exec("PRAGMA journal_mode = WAL;");
    this.initSchema();
    this.runIdempotentSeed();
    this.logger.log(`SQLite AdminDbService ready at ${dbPath}`);
  }

  private initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        category TEXT NOT NULL,
        label TEXT NOT NULL,
        description TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS ai_config (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        display_name TEXT NOT NULL,
        system_prompt TEXT NOT NULL,
        plans_directive TEXT NOT NULL,
        final_directives_es TEXT NOT NULL,
        final_directives_en TEXT NOT NULL,
        temperature REAL NOT NULL,
        primary_model TEXT NOT NULL,
        fallback_models TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS memories (
        slug TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        keywords TEXT NOT NULL,
        priority INTEGER NOT NULL DEFAULT 50,
        active INTEGER NOT NULL DEFAULT 1,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS shadowbans (
        ip TEXT PRIMARY KEY,
        reason TEXT NOT NULL,
        fake_reply_es TEXT NOT NULL,
        fake_reply_en TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        display_name TEXT NOT NULL,
        email TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'PARTNER',
        active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        company TEXT NOT NULL DEFAULT '',
        email TEXT NOT NULL DEFAULT '',
        phone TEXT NOT NULL DEFAULT '',
        plan TEXT NOT NULL DEFAULT 'General',
        status TEXT NOT NULL DEFAULT 'LEAD',
        notes TEXT NOT NULL DEFAULT '',
        assigned_to TEXT NOT NULL DEFAULT '',
        source TEXT NOT NULL DEFAULT 'CONTACT_FORM',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    try {
      this.db.exec(
        "ALTER TABLE clients ADD COLUMN assigned_to TEXT NOT NULL DEFAULT '';",
      );
    } catch {
      // Column already exists
    }
  }

  public hashPassword(password: string, salt?: string): string {
    const usedSalt = salt || crypto.randomBytes(16).toString("hex");
    const derived = crypto.scryptSync(password, usedSalt, 64).toString("hex");
    return `${usedSalt}:${derived}`;
  }

  public verifyPassword(password: string, storedHash: string): boolean {
    const [salt, key] = (storedHash || "").split(":");
    if (!salt || !key) return false;
    const derived = crypto.scryptSync(password, salt, 64).toString("hex");
    try {
      return crypto.timingSafeEqual(
        Buffer.from(key, "hex"),
        Buffer.from(derived, "hex"),
      );
    } catch {
      return false;
    }
  }

  private runIdempotentSeed() {
    const now = new Date().toISOString();

    // 1. Reconciliar usuario SUPERADMIN (brianleft) desde variables de entorno
    const adminUsername = (
      process.env.ADMIN_USERNAME || "brianleft"
    ).trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "123merlogomes123";
    const passwordHash = this.hashPassword(adminPassword);

    const existingUser = this.db
      .prepare("SELECT id FROM users WHERE username = ?")
      .get(adminUsername);

    if (existingUser) {
      this.db
        .prepare(
          "UPDATE users SET password_hash = ?, role = 'SUPERADMIN', active = 1, updated_at = ? WHERE username = ?",
        )
        .run(passwordHash, now, adminUsername);
    } else {
      this.db
        .prepare(
          `INSERT INTO users (username, display_name, email, password_hash, role, active, created_at, updated_at)
           VALUES (?, ?, ?, ?, 'SUPERADMIN', 1, ?, ?)`,
        )
        .run(
          adminUsername,
          "Brian Benegas",
          "soporte@pidgeonsolutions.com",
          passwordHash,
          now,
          now,
        );
    }

    // Sembrar socios base (Thomas Pineda y Gastón Alejandro) en Etapa 3
    const partners = [
      {
        username: "thomas",
        displayName: "Thomas Pineda",
        email: "thomas@pidgeonsolutions.com",
        role: "PARTNER",
      },
      {
        username: "gaston",
        displayName: "Gastón Alejandro",
        email: "gaston@pidgeonsolutions.com",
        role: "PARTNER",
      },
    ];
    for (const p of partners) {
      const exists = this.db
        .prepare("SELECT id FROM users WHERE username = ?")
        .get(p.username);
      if (!exists) {
        this.db
          .prepare(
            `INSERT INTO users (username, display_name, email, password_hash, role, active, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
          )
          .run(
            p.username,
            p.displayName,
            p.email,
            this.hashPassword(adminPassword),
            p.role,
            now,
            now,
          );
      }
    }

    // 2. Sembrar settings por defecto si no existen
    const insertSetting = this.db.prepare(`
      INSERT OR IGNORE INTO settings (key, value, category, label, description, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const s of DEFAULT_SETTINGS) {
      insertSetting.run(s.key, s.value, s.category, s.label, s.description, now);
    }

    // 3. Sembrar ai_config si no existe
    const existingAi = this.db
      .prepare("SELECT id FROM ai_config WHERE id = 1")
      .get();
    if (!existingAi) {
      this.db
        .prepare(
          `INSERT INTO ai_config (
            id, display_name, system_prompt, plans_directive,
            final_directives_es, final_directives_en, temperature,
            primary_model, fallback_models, updated_at
          ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          DEFAULT_AI_CONFIG.displayName,
          DEFAULT_AI_CONFIG.systemPrompt,
          DEFAULT_AI_CONFIG.plansDirective,
          DEFAULT_AI_CONFIG.finalDirectivesEs,
          DEFAULT_AI_CONFIG.finalDirectivesEn,
          DEFAULT_AI_CONFIG.temperature,
          DEFAULT_AI_CONFIG.primaryModel,
          DEFAULT_AI_CONFIG.fallbackModels,
          now,
        );
    }

    // 4. Sembrar memorias iniciales si no existen
    const insertMemory = this.db.prepare(`
      INSERT OR IGNORE INTO memories (slug, title, content, keywords, priority, active, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const m of KNOWLEDGE_ENTRIES) {
      insertMemory.run(
        m.slug,
        m.title,
        m.content,
        JSON.stringify(m.keywords),
        m.priority ?? 50,
        m.active !== false ? 1 : 0,
        now,
      );
    }
  }

  // --- Users & Auth (Etapa 3 RBAC) ---
  validateUserCredentials(
    username: string,
    password: string,
  ): AdminUserItem | null {
    const cleanUser = (username || "").trim().toLowerCase();
    const row = this.db
      .prepare("SELECT * FROM users WHERE username = ? AND active = 1")
      .get(cleanUser);
    if (!row) return null;
    if (!this.verifyPassword(password, row.password_hash)) return null;

    return {
      id: row.id,
      username: row.username,
      displayName: row.display_name,
      email: row.email,
      role: row.role,
      active: Boolean(row.active),
      createdAt: row.created_at,
    };
  }

  getUserByUsername(username: string): AdminUserItem | null {
    const row = this.db
      .prepare("SELECT * FROM users WHERE username = ? AND active = 1")
      .get((username || "").trim().toLowerCase());
    if (!row) return null;
    return {
      id: row.id,
      username: row.username,
      displayName: row.display_name,
      email: row.email,
      role: row.role,
      active: Boolean(row.active),
      createdAt: row.created_at,
    };
  }

  getAllUsers(): AdminUserItem[] {
    const rows = this.db
      .prepare("SELECT * FROM users ORDER BY id ASC")
      .all();
    return rows.map((row: any) => ({
      id: row.id,
      username: row.username,
      displayName: row.display_name,
      email: row.email,
      role: row.role,
      active: Boolean(row.active),
      createdAt: row.created_at,
    }));
  }

  upsertUser(data: {
    username: string;
    displayName: string;
    email: string;
    role?: AdminUserItem["role"];
    active?: boolean;
    password?: string;
  }): AdminUserItem[] {
    const cleanUsername = (data.username || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "");
    if (!cleanUsername) return this.getAllUsers();

    const validRoles: AdminUserItem["role"][] = [
      "SUPERADMIN",
      "PARTNER",
      "SALES",
      "VIEWER",
    ];
    const role: AdminUserItem["role"] = validRoles.includes(
      data.role as AdminUserItem["role"],
    )
      ? (data.role as AdminUserItem["role"])
      : "PARTNER";

    const displayName = (data.displayName || cleanUsername).trim();
    const email = (
      data.email || `${cleanUsername}@pidgeonsolutions.com`
    ).trim();
    const isMainSuperadmin = cleanUsername === "brianleft";
    const activeInt = isMainSuperadmin ? 1 : data.active !== false ? 1 : 0;
    const effectiveRole: AdminUserItem["role"] = isMainSuperadmin
      ? "SUPERADMIN"
      : role;
    const now = new Date().toISOString();

    const existing = this.db
      .prepare("SELECT * FROM users WHERE username = ?")
      .get(cleanUsername);

    if (existing) {
      const nextHash =
        data.password && data.password.trim().length > 0
          ? this.hashPassword(data.password.trim())
          : existing.password_hash;

      this.db
        .prepare(
          `UPDATE users
           SET display_name = ?, email = ?, password_hash = ?, role = ?, active = ?, updated_at = ?
           WHERE username = ?`,
        )
        .run(
          displayName,
          email,
          nextHash,
          effectiveRole,
          activeInt,
          now,
          cleanUsername,
        );
    } else {
      const defaultPass =
        data.password && data.password.trim().length > 0
          ? data.password.trim()
          : process.env.ADMIN_PASSWORD || "123merlogomes123";
      const passwordHash = this.hashPassword(defaultPass);

      this.db
        .prepare(
          `INSERT INTO users (username, display_name, email, password_hash, role, active, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          cleanUsername,
          displayName,
          email,
          passwordHash,
          effectiveRole,
          activeInt,
          now,
          now,
        );
    }

    return this.getAllUsers();
  }

  deleteUser(username: string): AdminUserItem[] {
    const clean = (username || "").trim().toLowerCase();
    if (!clean || clean === "brianleft") {
      return this.getAllUsers();
    }
    this.db.prepare("DELETE FROM users WHERE username = ?").run(clean);
    return this.getAllUsers();
  }

  // --- Settings (Placeholders) ---
  getSettings(): SettingItem[] {
    const rows = this.db
      .prepare("SELECT * FROM settings ORDER BY category ASC, key ASC")
      .all();
    return rows.map((r: any) => ({
      key: r.key,
      value: r.value,
      category: r.category,
      label: r.label,
      description: r.description,
    }));
  }

  getSettingsMap(): Record<string, string> {
    const rows = this.db.prepare("SELECT key, value FROM settings").all();
    const map: Record<string, string> = {};
    for (const r of rows) {
      map[r.key] = r.value;
    }
    return map;
  }

  updateSettings(items: { key: string; value: string }[]): SettingItem[] {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(
      "UPDATE settings SET value = ?, updated_at = ? WHERE key = ?",
    );
    for (const item of items) {
      if (item.key && typeof item.value === "string") {
        stmt.run(item.value.trim(), now, item.key);
      }
    }
    return this.getSettings();
  }

  // --- AI Config ---
  getAiConfig(): AiConfigData {
    const row = this.db
      .prepare("SELECT * FROM ai_config WHERE id = 1")
      .get();
    if (!row) return DEFAULT_AI_CONFIG;
    return {
      displayName: row.display_name,
      systemPrompt: row.system_prompt,
      plansDirective: row.plans_directive,
      finalDirectivesEs: row.final_directives_es,
      finalDirectivesEn: row.final_directives_en,
      temperature: Number(row.temperature ?? 0.35),
      primaryModel: row.primary_model,
      fallbackModels: row.fallback_models,
    };
  }

  updateAiConfig(data: Partial<AiConfigData>): AiConfigData {
    const current = this.getAiConfig();
    const next: AiConfigData = {
      displayName: data.displayName ?? current.displayName,
      systemPrompt: data.systemPrompt ?? current.systemPrompt,
      plansDirective: data.plansDirective ?? current.plansDirective,
      finalDirectivesEs: data.finalDirectivesEs ?? current.finalDirectivesEs,
      finalDirectivesEn: data.finalDirectivesEn ?? current.finalDirectivesEn,
      temperature:
        data.temperature !== undefined
          ? Math.max(0, Math.min(1, Number(data.temperature)))
          : current.temperature,
      primaryModel: (data.primaryModel ?? current.primaryModel).trim(),
      fallbackModels: (data.fallbackModels ?? current.fallbackModels).trim(),
    };
    const now = new Date().toISOString();
    this.db
      .prepare(
        `UPDATE ai_config SET
          display_name = ?, system_prompt = ?, plans_directive = ?,
          final_directives_es = ?, final_directives_en = ?, temperature = ?,
          primary_model = ?, fallback_models = ?, updated_at = ?
         WHERE id = 1`,
      )
      .run(
        next.displayName,
        next.systemPrompt,
        next.plansDirective,
        next.finalDirectivesEs,
        next.finalDirectivesEn,
        next.temperature,
        next.primaryModel,
        next.fallbackModels,
        now,
      );
    return this.getAiConfig();
  }

  // --- Memories (RAG) ---
  getMemories(): KnowledgeEntry[] {
    const rows = this.db
      .prepare("SELECT * FROM memories ORDER BY priority DESC, slug ASC")
      .all();
    return rows.map((r: any) => {
      let parsedKeywords: string[] = [];
      try {
        parsedKeywords = JSON.parse(r.keywords || "[]");
      } catch {
        parsedKeywords = [];
      }
      return {
        slug: r.slug,
        title: r.title,
        content: r.content,
        keywords: parsedKeywords,
        priority: Number(r.priority ?? 50),
        active: Boolean(r.active),
      };
    });
  }

  upsertMemory(entry: KnowledgeEntry): KnowledgeEntry[] {
    const slug = entry.slug
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (!slug) return this.getMemories();

    const now = new Date().toISOString();
    const keywordsJson = JSON.stringify(
      (entry.keywords || []).map((k) => k.trim()).filter(Boolean),
    );
    const priority = Number(entry.priority ?? 50);
    const active = entry.active !== false ? 1 : 0;

    this.db
      .prepare(
        `INSERT INTO memories (slug, title, content, keywords, priority, active, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(slug) DO UPDATE SET
           title = excluded.title,
           content = excluded.content,
           keywords = excluded.keywords,
           priority = excluded.priority,
           active = excluded.active,
           updated_at = excluded.updated_at`,
      )
      .run(slug, entry.title, entry.content, keywordsJson, priority, active, now);

    return this.getMemories();
  }

  deleteMemory(slug: string): KnowledgeEntry[] {
    if (slug === "base") {
      return this.getMemories();
    }
    this.db.prepare("DELETE FROM memories WHERE slug = ?").run(slug);
    return this.getMemories();
  }

  // --- Shadowbans ---
  getShadowbans(): ShadowbanItem[] {
    const rows = this.db
      .prepare("SELECT * FROM shadowbans ORDER BY created_at DESC")
      .all();
    return rows.map((r: any) => ({
      ip: r.ip,
      reason: r.reason,
      fakeReplyEs: r.fake_reply_es,
      fakeReplyEn: r.fake_reply_en,
      createdAt: r.created_at,
    }));
  }

  getShadowbanForIp(ip?: string): ShadowbanItem | null {
    if (!ip) return null;
    const cleanIp = ip.trim();
    const row = this.db
      .prepare("SELECT * FROM shadowbans WHERE ip = ?")
      .get(cleanIp);
    if (!row) return null;
    return {
      ip: row.ip,
      reason: row.reason,
      fakeReplyEs: row.fake_reply_es,
      fakeReplyEn: row.fake_reply_en,
      createdAt: row.created_at,
    };
  }

  upsertShadowban(item: {
    ip: string;
    reason?: string;
    fakeReplyEs?: string;
    fakeReplyEn?: string;
  }): ShadowbanItem[] {
    const cleanIp = (item.ip || "").trim();
    if (!cleanIp) return this.getShadowbans();
    const now = new Date().toISOString();
    const defaultEs =
      "Gracias por tu consulta. En este momento nuestros especialistas están revisando tu solicitud; podés dejarnos tus datos en el formulario de contacto.";
    const defaultEn =
      "Thank you for your inquiry. Our specialists are currently reviewing requests; please leave your details in the contact form.";

    this.db
      .prepare(
        `INSERT INTO shadowbans (ip, reason, fake_reply_es, fake_reply_en, created_at)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(ip) DO UPDATE SET
           reason = excluded.reason,
           fake_reply_es = excluded.fake_reply_es,
           fake_reply_en = excluded.fake_reply_en`,
      )
      .run(
        cleanIp,
        (item.reason || "Uso abusivo / spam").trim(),
        (item.fakeReplyEs || defaultEs).trim(),
        (item.fakeReplyEn || defaultEn).trim(),
        now,
      );

    return this.getShadowbans();
  }

  removeShadowban(ip: string): ShadowbanItem[] {
    this.db.prepare("DELETE FROM shadowbans WHERE ip = ?").run((ip || "").trim());
    return this.getShadowbans();
  }

  // --- Clients & Leads (Etapa 3: Catálogo de Clientes & Mini-CRM) ---
  getClients(): ClientLeadItem[] {
    const rows = this.db
      .prepare("SELECT * FROM clients ORDER BY updated_at DESC, id DESC LIMIT 200")
      .all();
    return rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      company: r.company,
      email: r.email,
      phone: r.phone,
      plan: r.plan,
      status: r.status,
      notes: r.notes,
      assignedTo: r.assigned_to || "",
      source: r.source,
      createdAt: r.created_at,
      updatedAt: r.updated_at || r.created_at,
    }));
  }

  upsertClient(data: {
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
  }): ClientLeadItem[] {
    const name = (data.name || "").trim();
    if (!name) return this.getClients();

    const validStatuses: ClientLeadItem["status"][] = [
      "LEAD",
      "CONTACTED",
      "DEMO",
      "ACTIVE",
      "PAUSED",
    ];
    const status: ClientLeadItem["status"] = validStatuses.includes(
      data.status as ClientLeadItem["status"],
    )
      ? (data.status as ClientLeadItem["status"])
      : "LEAD";

    const company = (data.company || "").trim();
    const email = (data.email || "").trim();
    const phone = (data.phone || "").trim();
    const plan = (data.plan || "General").trim();
    const notes = (data.notes || "").trim();
    const assignedTo = (data.assignedTo || "").trim().toLowerCase();
    const source = (data.source || "BACKOFFICE").trim();
    const now = new Date().toISOString();

    if (data.id && Number(data.id) > 0) {
      this.db
        .prepare(
          `UPDATE clients
           SET name = ?, company = ?, email = ?, phone = ?, plan = ?, status = ?, notes = ?, assigned_to = ?, updated_at = ?
           WHERE id = ?`,
        )
        .run(
          name,
          company,
          email,
          phone,
          plan,
          status,
          notes,
          assignedTo,
          now,
          Number(data.id),
        );
    } else {
      this.db
        .prepare(
          `INSERT INTO clients (name, company, email, phone, plan, status, notes, assigned_to, source, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          name,
          company,
          email,
          phone,
          plan,
          status,
          notes,
          assignedTo,
          source,
          now,
          now,
        );
    }

    return this.getClients();
  }

  deleteClient(id: number): ClientLeadItem[] {
    const cleanId = Number(id);
    if (!cleanId || cleanId <= 0) return this.getClients();
    this.db.prepare("DELETE FROM clients WHERE id = ?").run(cleanId);
    return this.getClients();
  }

  recordContactLead(data: {
    name: string;
    email: string;
    company?: string;
    message: string;
    plan?: string;
  }) {
    const now = new Date().toISOString();
    this.db
      .prepare(
        `INSERT INTO clients (name, company, email, phone, plan, status, notes, assigned_to, source, created_at, updated_at)
         VALUES (?, ?, ?, '', ?, 'LEAD', ?, '', 'CONTACT_FORM', ?, ?)`,
      )
      .run(
        data.name || "Sin nombre",
        data.company || "",
        data.email || "",
        data.plan || "Consulta Web",
        data.message || "",
        now,
        now,
      );
  }
}
