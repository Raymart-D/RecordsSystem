import { 
  records, 
  scannerConfigs, 
  type Record, 
  type InsertRecord, 
  type UpdateRecord, 
  type ScannerConfig, 
  type InsertScannerConfig 
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // Records
  getAllRecords(): Promise<Record[]>;
  getRecordById(id: number): Promise<Record | undefined>;
  getRecordsByCategory(category: string): Promise<Record[]>;
  createRecord(record: InsertRecord): Promise<Record>;
  updateRecord(id: number, record: UpdateRecord): Promise<Record | undefined>;
  deleteRecord(id: number): Promise<boolean>;
  searchRecords(query: string): Promise<Record[]>;
  getRecordStats(): Promise<{
    totalRecords: number;
    recordsByCategory: { category: string; count: number }[];
    recentRecords: Record[];
  }>;
  
  // Scanner Configuration
  getScannerConfig(): Promise<ScannerConfig | undefined>;
  updateScannerConfig(config: Partial<InsertScannerConfig>): Promise<ScannerConfig>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private records: Map<number, Record>;
  private scannerConfig: ScannerConfig;
  private currentRecordId: number;

  constructor() {
    this.records = new Map();
    this.currentRecordId = 1;
    
    // Initialize with sample scanner configuration
    this.scannerConfig = {
      id: 1,
      modelName: "Brother ADS-2400N",
      ipAddress: "192.168.1.100",
      resolution: 300,
      colorMode: "Color",
      duplex: true,
      autoFeeder: true,
      isConnected: false,
      lastConnected: new Date()
    };
    
    // Seed with some initial records for testing
    const sampleCategories = ["Invoice", "Receipt", "Contract", "Report", "Form"];
    const sampleFileTypes = ["PDF", "DOCX", "XLSX", "JPG", "PNG"];
    
    for (let i = 1; i <= 20; i++) {
      const categoryIndex = (i % 5);
      this.records.set(i, {
        id: i,
        title: `Sample Record ${i}`,
        category: sampleCategories[categoryIndex] as any,
        status: "Active" as any,
        fileType: sampleFileTypes[i % 5],
        fileSize: Math.floor(Math.random() * 5000) + 100, // Random file size between 100-5100 KB
        content: `This is content for record ${i}`,
        tags: `tag1,tag${i}`,
        dateCreated: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000), // Random date within last 30 days
        dateModified: new Date(),
        isFavorite: i % 5 === 0 // Every 5th record is a favorite
      });
    }
    
    this.currentRecordId = 21; // Set next ID after sample data
  }

  // Records methods
  async getAllRecords(): Promise<Record[]> {
    return Array.from(this.records.values()).sort((a, b) => b.id - a.id);
  }

  async getRecordById(id: number): Promise<Record | undefined> {
    return this.records.get(id);
  }

  async getRecordsByCategory(category: string): Promise<Record[]> {
    return Array.from(this.records.values()).filter(
      (record) => record.category.toLowerCase() === category.toLowerCase()
    );
  }

  async createRecord(record: InsertRecord): Promise<Record> {
    const id = this.currentRecordId++;
    const now = new Date();
    
    const newRecord: Record = {
      id,
      ...record,
      dateCreated: now,
      dateModified: now 
    };
    
    this.records.set(id, newRecord);
    return newRecord;
  }

  async updateRecord(id: number, updateData: UpdateRecord): Promise<Record | undefined> {
    const existingRecord = this.records.get(id);
    
    if (!existingRecord) return undefined;
    
    const updatedRecord: Record = {
      ...existingRecord,
      ...updateData,
      dateModified: new Date()
    };
    
    this.records.set(id, updatedRecord);
    return updatedRecord;
  }

  async deleteRecord(id: number): Promise<boolean> {
    return this.records.delete(id);
  }

  async searchRecords(query: string): Promise<Record[]> {
    if (!query) return this.getAllRecords();
    
    const lowerQuery = query.toLowerCase();
    return Array.from(this.records.values()).filter(record => 
      record.title.toLowerCase().includes(lowerQuery) || 
      record.category.toLowerCase().includes(lowerQuery) || 
      record.content?.toLowerCase().includes(lowerQuery) || 
      record.tags?.toLowerCase().includes(lowerQuery)
    );
  }

  async getRecordStats(): Promise<{
    totalRecords: number;
    recordsByCategory: { category: string; count: number }[];
    recentRecords: Record[];
  }> {
    const allRecords = Array.from(this.records.values());
    
    // Get category counts
    const categoryCounts = new Map<string, number>();
    
    allRecords.forEach(record => {
      const currentCount = categoryCounts.get(record.category) || 0;
      categoryCounts.set(record.category, currentCount + 1);
    });
    
    // Convert to array of objects
    const recordsByCategory = Array.from(categoryCounts.entries()).map(
      ([category, count]) => ({ category, count })
    );
    
    // Get 5 most recent records
    const recentRecords = [...allRecords]
      .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
      .slice(0, 5);
    
    return {
      totalRecords: allRecords.length,
      recordsByCategory,
      recentRecords
    };
  }

  // Scanner configuration methods
  async getScannerConfig(): Promise<ScannerConfig | undefined> {
    return this.scannerConfig;
  }

  async updateScannerConfig(config: Partial<InsertScannerConfig>): Promise<ScannerConfig> {
    this.scannerConfig = {
      ...this.scannerConfig,
      ...config,
      lastConnected: new Date()
    };
    
    return this.scannerConfig;
  }
}

export const storage = new MemStorage();
