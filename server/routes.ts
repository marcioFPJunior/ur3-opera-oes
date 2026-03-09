import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOperationSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/operations", async (req, res) => {
    try {
      const parsed = insertOperationSchema.parse(req.body);
      const operation = await storage.addOperation(parsed);
      res.json(operation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/operations", async (req, res) => {
    try {
      const ops = await storage.getOperations();
      res.json(ops);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/operations/category/:category", async (req, res) => {
    try {
      const ops = await storage.getOperationsByCategory(req.params.category);
      res.json(ops);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/operations/:id", async (req, res) => {
    try {
      await storage.deleteOperation(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/operations", async (req, res) => {
    try {
      await storage.clearAllOperations();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
