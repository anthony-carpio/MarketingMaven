import { campaigns, auditLogs, users, type Campaign, type InsertCampaign, type AuditLog, type InsertAuditLog, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Campaign operations
  getCampaigns(): Promise<Campaign[]>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, campaign: Partial<InsertCampaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: number): Promise<boolean>;
  
  // Audit log operations
  getAuditLogs(limit?: number, offset?: number): Promise<AuditLog[]>;
  createAuditLog(auditLog: InsertAuditLog): Promise<AuditLog>;
  getAuditLogsCount(): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private campaigns: Map<number, Campaign>;
  private auditLogs: Map<number, AuditLog>;
  private currentUserId: number;
  private currentCampaignId: number;
  private currentAuditLogId: number;

  constructor() {
    this.users = new Map();
    this.campaigns = new Map();
    this.auditLogs = new Map();
    this.currentUserId = 1;
    this.currentCampaignId = 1;
    this.currentAuditLogId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = this.currentCampaignId++;
    const now = new Date();
    const campaign: Campaign = {
      ...insertCampaign,
      id,
      budget: insertCampaign.budget,
      startDate: new Date(insertCampaign.startDate),
      endDate: new Date(insertCampaign.endDate),
      targetAudience: insertCampaign.targetAudience || [],
      status: insertCampaign.status || "draft",
      progress: insertCampaign.progress || 0,
      createdAt: now,
      updatedAt: now,
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async updateCampaign(id: number, updates: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;

    const updatedCampaign: Campaign = {
      ...campaign,
      ...updates,
      id,
      updatedAt: new Date(),
      startDate: updates.startDate ? new Date(updates.startDate) : campaign.startDate,
      endDate: updates.endDate ? new Date(updates.endDate) : campaign.endDate,
    };
    
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  async deleteCampaign(id: number): Promise<boolean> {
    return this.campaigns.delete(id);
  }

  async getAuditLogs(limit: number = 50, offset: number = 0): Promise<AuditLog[]> {
    const logs = Array.from(this.auditLogs.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(offset, offset + limit);
    return logs;
  }

  async createAuditLog(insertAuditLog: InsertAuditLog): Promise<AuditLog> {
    const id = this.currentAuditLogId++;
    const auditLog: AuditLog = {
      ...insertAuditLog,
      id,
      resourceId: insertAuditLog.resourceId || null,
      changes: insertAuditLog.changes || null,
      ipAddress: insertAuditLog.ipAddress || null,
      timestamp: new Date(),
    };
    this.auditLogs.set(id, auditLog);
    return auditLog;
  }

  async getAuditLogsCount(): Promise<number> {
    return this.auditLogs.size;
  }
}

export const storage = new MemStorage();
