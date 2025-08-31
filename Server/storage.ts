// Simplified storage interface - no persistent data needed for demo
export interface IStorage {
  // No methods needed for simplified version
}

export class MemStorage implements IStorage {
  constructor() {
    // No storage needed for simplified demo
  }
}

export const storage = new MemStorage();
