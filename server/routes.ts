import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCampaignSchema, insertAuditLogSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to create audit log
  const createAuditLog = async (
    action: string,
    resource: string,
    resourceId?: string,
    changes?: string,
    req?: any
  ) => {
    await storage.createAuditLog({
      userId: "user-1", // In a real app, this would come from session
      userName: "Sarah Johnson",
      action,
      resource,
      resourceId,
      changes,
      ipAddress: req?.ip || req?.connection?.remoteAddress || "127.0.0.1",
    });
  };

  // Get all campaigns
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  // Get single campaign
  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  // Create campaign
  app.post("/api/campaigns", async (req, res) => {
    try {
      const validatedData = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(validatedData);
      
      await createAuditLog(
        "Campaign Created",
        campaign.name,
        campaign.id.toString(),
        `Budget: $${validatedData.budget}, Status: ${validatedData.status}`,
        req
      );
      
      res.status(201).json(campaign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  // Update campaign
  app.put("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existingCampaign = await storage.getCampaign(id);
      
      if (!existingCampaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      const validatedData = insertCampaignSchema.partial().parse(req.body);
      const updatedCampaign = await storage.updateCampaign(id, validatedData);
      
      // Create audit log for changes
      const changes = [];
      if (validatedData.status && validatedData.status !== existingCampaign.status) {
        changes.push(`Status: ${existingCampaign.status} → ${validatedData.status}`);
      }
      if (validatedData.budget && validatedData.budget !== existingCampaign.budget) {
        changes.push(`Budget: $${existingCampaign.budget} → $${validatedData.budget}`);
      }
      if (validatedData.name && validatedData.name !== existingCampaign.name) {
        changes.push(`Name: ${existingCampaign.name} → ${validatedData.name}`);
      }
      
      await createAuditLog(
        "Campaign Updated",
        updatedCampaign?.name || existingCampaign.name,
        id.toString(),
        changes.join(", "),
        req
      );
      
      res.json(updatedCampaign);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  // Delete campaign
  app.delete("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      const deleted = await storage.deleteCampaign(id);
      
      if (deleted) {
        await createAuditLog(
          "Campaign Deleted",
          campaign.name,
          id.toString(),
          `Budget: $${campaign.budget}`,
          req
        );
        res.json({ success: true });
      } else {
        res.status(500).json({ message: "Failed to delete campaign" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete campaign" });
    }
  });

  // Get audit logs
  app.get("/api/audit-logs", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const logs = await storage.getAuditLogs(limit, offset);
      const total = await storage.getAuditLogsCount();
      
      res.json({ logs, total });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  // Get dashboard metrics
  app.get("/api/metrics", async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      
      const activeCampaigns = campaigns.filter(c => c.status === "active").length;
      const totalBudget = campaigns.reduce((sum, c) => sum + parseFloat(c.budget), 0);
      const avgProgress = campaigns.length > 0 
        ? campaigns.reduce((sum, c) => sum + c.progress, 0) / campaigns.length 
        : 0;
      
      res.json({
        activeCampaigns,
        totalCampaigns: campaigns.length,
        totalBudget,
        conversionRate: 3.2, // Mock data for demo
        roi: 245, // Mock data for demo
        avgProgress: Math.round(avgProgress),
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
