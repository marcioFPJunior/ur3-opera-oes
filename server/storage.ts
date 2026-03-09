import { db } from "./db";
import { operations } from "@shared/schema";
import { type Operation, type InsertOperation } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  addOperation(op: InsertOperation): Promise<Operation>;
  getOperations(): Promise<Operation[]>;
  getOperationsByCategory(category: string): Promise<Operation[]>;
  updateOperation(id: string, data: Partial<InsertOperation>): Promise<Operation>;
  deleteOperation(id: string): Promise<void>;
  clearAllOperations(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async addOperation(op: InsertOperation): Promise<Operation> {
    const result = await db.insert(operations).values(op).returning();
    return result[0];
  }

  async getOperations(): Promise<Operation[]> {
    return db.select().from(operations).orderBy(desc(operations.date));
  }

  async getOperationsByCategory(category: string): Promise<Operation[]> {
    return db
      .select()
      .from(operations)
      .where(eq(operations.category, category))
      .orderBy(desc(operations.date));
  }

  async updateOperation(id: string, data: Partial<InsertOperation>): Promise<Operation> {
    const result = await db
      .update(operations)
      .set(data)
      .where(eq(operations.id, id))
      .returning();
    return result[0];
  }

  async deleteOperation(id: string): Promise<void> {
    await db.delete(operations).where(eq(operations.id, id));
  }

  async clearAllOperations(): Promise<void> {
    await db.delete(operations);
  }
}

export const storage = new DatabaseStorage();
