import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRecordSchema, updateRecordSchema, insertScannerConfigSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes - all prefixed with /api
  
  // Get record statistics for dashboard
  app.get("/api/stats", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getRecordStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch record statistics" });
    }
  });

  // Get all records
  app.get("/api/records", async (req: Request, res: Response) => {
    try {
      const records = await storage.getAllRecords();
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch records" });
    }
  });

  // Get a single record by ID
  app.get("/api/records/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid record ID" });
      }

      const record = await storage.getRecordById(id);
      if (!record) {
        return res.status(404).json({ message: "Record not found" });
      }

      res.json(record);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch record" });
    }
  });

  // Create a new record
  app.post("/api/records", async (req: Request, res: Response) => {
    try {
      const validatedData = insertRecordSchema.parse(req.body);
      const newRecord = await storage.createRecord(validatedData);
      res.status(201).json(newRecord);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid record data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create record" });
    }
  });

  // Update an existing record
  app.patch("/api/records/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid record ID" });
      }

      const validatedData = updateRecordSchema.parse(req.body);
      const updatedRecord = await storage.updateRecord(id, validatedData);
      
      if (!updatedRecord) {
        return res.status(404).json({ message: "Record not found" });
      }

      res.json(updatedRecord);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid record data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update record" });
    }
  });

  // Delete a record
  app.delete("/api/records/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid record ID" });
      }

      const success = await storage.deleteRecord(id);
      if (!success) {
        return res.status(404).json({ message: "Record not found" });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete record" });
    }
  });

  // Search records
  app.get("/api/records/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string || "";
      const results = await storage.searchRecords(query);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to search records" });
    }
  });

  // Get scanner configuration
  app.get("/api/scanner/config", async (req: Request, res: Response) => {
    try {
      const config = await storage.getScannerConfig();
      if (!config) {
        return res.status(404).json({ message: "Scanner configuration not found" });
      }
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scanner configuration" });
    }
  });

  // Update scanner configuration
  app.patch("/api/scanner/config", async (req: Request, res: Response) => {
    try {
      const validatedData = insertScannerConfigSchema.partial().parse(req.body);
      const updatedConfig = await storage.updateScannerConfig(validatedData);
      res.json(updatedConfig);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid scanner config", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update scanner configuration" });
    }
  });

  // Connect to scanner
  app.post("/api/scanner/connect", async (req: Request, res: Response) => {
    try {
      // In a real application, this would initiate a connection to the scanner
      // For now, we'll simulate a successful connection
      const config = await storage.getScannerConfig();
      if (!config) {
        return res.status(404).json({ message: "Scanner configuration not found" });
      }
      
      const updatedConfig = await storage.updateScannerConfig({
        isConnected: true,
        lastConnected: new Date()
      });
      
      res.json({
        success: true,
        message: "Successfully connected to scanner",
        config: updatedConfig
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Failed to connect to scanner" 
      });
    }
  });

  // Disconnect from scanner
  app.post("/api/scanner/disconnect", async (req: Request, res: Response) => {
    try {
      const config = await storage.getScannerConfig();
      if (!config) {
        return res.status(404).json({ message: "Scanner configuration not found" });
      }
      
      const updatedConfig = await storage.updateScannerConfig({
        isConnected: false
      });
      
      res.json({
        success: true,
        message: "Successfully disconnected from scanner",
        config: updatedConfig
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Failed to disconnect from scanner" 
      });
    }
  });

  // Scan document (simulation)
  app.post("/api/scanner/scan", async (req: Request, res: Response) => {
    try {
      const config = await storage.getScannerConfig();
      if (!config) {
        return res.status(404).json({ message: "Scanner configuration not found" });
      }
      
      if (!config.isConnected) {
        return res.status(400).json({ 
          success: false,
          message: "Scanner is not connected" 
        });
      }
      
      // Simulate scanning process
      // In a real application, this would communicate with the scanner
      // and return the scanned document
      
      // Create a new record for the scanned document
      const newRecord = await storage.createRecord({
        title: `Scanned Document ${new Date().toLocaleString()}`,
        category: "Form",
        status: "Pending Review",
        fileType: "PDF",
        fileSize: Math.floor(Math.random() * 1000) + 500, // Random file size
        content: "Automatically scanned document",
        tags: "scan,auto",
        dateCreated: new Date(),
        dateModified: new Date(),
        isFavorite: false
      });
      
      res.json({
        success: true,
        message: "Document scanned successfully",
        record: newRecord
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Failed to scan document" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
