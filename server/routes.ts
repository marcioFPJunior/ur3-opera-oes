import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // API routes not needed - using localStorage for synchronization
  // Storage sync happens via browser's storage events (cross-tab/cross-device)
  return httpServer;
}
