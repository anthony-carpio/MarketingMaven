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
    
    // Add sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample campaigns
    const sampleCampaigns = [
      {
        name: "Q4 Email Marketing Push",
        description: "End-of-year promotional email campaign targeting existing customers",
        type: "Email Marketing",
        status: "active",
        budget: "15000",
        startDate: "2024-12-01",
        endDate: "2024-12-31",
        targetAudience: ["26-35", "36-45"],
        progress: 65,
      },
      {
        name: "Social Media Brand Awareness",
        description: "Instagram and Facebook campaign to increase brand visibility",
        type: "Social Media",
        status: "active",
        budget: "8500",
        startDate: "2024-11-15",
        endDate: "2025-01-15",
        targetAudience: ["18-25", "26-35"],
        progress: 40,
      },
      {
        name: "Google Ads Holiday Campaign",
        description: "PPC campaign targeting holiday shoppers",
        type: "PPC Advertising",
        status: "completed",
        budget: "25000",
        startDate: "2024-11-01",
        endDate: "2024-12-25",
        targetAudience: ["26-35", "36-45", "45+"],
        progress: 100,
      },
      {
        name: "Content Marketing Initiative",
        description: "Blog posts and articles to drive organic traffic",
        type: "Content Marketing",
        status: "draft",
        budget: "5000",
        startDate: "2025-01-01",
        endDate: "2025-03-31",
        targetAudience: ["26-35", "36-45"],
        progress: 10,
      },
      {
        name: "Influencer Collaboration",
        description: "Partnership with industry influencers for product promotion",
        type: "Influencer Marketing",
        status: "paused",
        budget: "12000",
        startDate: "2024-10-01",
        endDate: "2024-12-31",
        targetAudience: ["18-25", "26-35"],
        progress: 30,
      }
    ];

    sampleCampaigns.forEach(campaign => {
      const id = this.currentCampaignId++;
      const now = new Date();
      const campaignData: Campaign = {
        ...campaign,
        id,
        startDate: new Date(campaign.startDate),
        endDate: new Date(campaign.endDate),
        createdAt: now,
        updatedAt: now,
      };
      this.campaigns.set(id, campaignData);

      // Add corresponding audit log
      const auditId = this.currentAuditLogId++;
      const auditLog: AuditLog = {
        id: auditId,
        userId: "user-1",
        userName: "Sarah Johnson",
        action: "Campaign Created",
        resource: campaign.name,
        resourceId: id.toString(),
        changes: `Budget: $${campaign.budget}, Status: ${campaign.status}`,
        ipAddress: "192.168.1.100",
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      };
      this.auditLogs.set(auditId, auditLog);
    });

    // Add additional audit logs for variety
    const additionalLogs = [
      {
        action: "Campaign Updated",
        resource: "Q4 Email Marketing Push",
        changes: "Status: draft → active",
      },
      {
        action: "Budget Modified",
        resource: "Social Media Brand Awareness",
        changes: "Budget: $7500 → $8500",
      },
      {
        action: "Campaign Updated",
        resource: "Google Ads Holiday Campaign",
        changes: "Progress: 85% → 100%, Status: active → completed",
      },
      {
        action: "Campaign Updated",
        resource: "Influencer Collaboration",
        changes: "Status: active → paused",
      }
    ];

    additionalLogs.forEach((log, index) => {
      const auditId = this.currentAuditLogId++;
      const auditLog: AuditLog = {
        id: auditId,
        userId: "user-1",
        userName: "Sarah Johnson",
        action: log.action,
        resource: log.resource,
        resourceId: (index + 1).toString(),
        changes: log.changes,
        ipAddress: "192.168.1.100",
        timestamp: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000), // Random date within last 15 days
      };
      this.auditLogs.set(auditId, auditLog);
    });
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
