import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// No persistent storage - simplified for demo only

export const classifyTextSchema = z.object({
  text: z.string().min(1, "Description is required").max(500, "Description too long"),
});

export const classifyImageSchema = z.object({
  filename: z.string(),
  size: z.number(),
  mimetype: z.string(),
});

export type ClassifyTextRequest = z.infer<typeof classifyTextSchema>;
export type ClassifyImageRequest = z.infer<typeof classifyImageSchema>;

export interface ClassificationResult {
  label: 'recyclable' | 'biodegradable' | 'hazardous';
  confidence: number;
  tip: string;
}
