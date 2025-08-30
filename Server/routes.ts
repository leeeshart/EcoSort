import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { classifyTextSchema, classifyImageSchema, type ClassificationResult } from "@shared/schema";
import { ZodError } from "zod";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 16 * 1024 * 1024, // 16MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  },
});

// Waste classification keywords
const WASTE_KEYWORDS = {
  recyclable: [
    'plastic', 'bottle', 'can', 'aluminum', 'paper', 'cardboard',
    'glass', 'newspaper', 'magazine', 'metal', 'tin', 'steel',
    'container', 'jar', 'box', 'packaging', 'wrapper', 'bag',
    'cup', 'plate', 'tray', 'carton', 'tube', 'foil'
  ],
  biodegradable: [
    'banana', 'apple', 'orange', 'fruit', 'vegetable', 'food',
    'organic', 'compost', 'leaf', 'wood', 'branch', 'plant',
    'peel', 'core', 'scrap', 'leftover', 'garden', 'yard',
    'flower', 'grass', 'tree', 'seed', 'shell', 'bone'
  ],
  hazardous: [
    'battery', 'electronic', 'chemical', 'paint', 'oil', 'toxic',
    'medical', 'needle', 'syringe', 'medicine', 'drug', 'acid',
    'cleaning', 'detergent', 'bleach', 'pesticide', 'solvent',
    'fluorescent', 'bulb', 'thermometer', 'asbestos'
  ]
};

function classifyTextContent(text: string): ClassificationResult {
  const textLower = text.toLowerCase();
  const scores = { recyclable: 0, biodegradable: 0, hazardous: 0 };

  // Calculate scores for each category
  for (const [category, keywords] of Object.entries(WASTE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (textLower.includes(keyword)) {
        scores[category as keyof typeof scores]++;
      }
    }
  }

  // Determine best category
  if (Object.values(scores).every(score => score === 0)) {
    return {
      label: 'recyclable',
      confidence: 0.30,
      tip: getDisposalTip('recyclable')
    };
  }

  const bestCategory = Object.entries(scores).reduce((a, b) => 
    scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
  )[0] as 'recyclable' | 'biodegradable' | 'hazardous';

  const maxScore = scores[bestCategory];
  const confidence = Math.min(0.95, 0.60 + (maxScore * 0.10));

  return {
    label: bestCategory,
    confidence: Math.round(confidence * 100) / 100,
    tip: getDisposalTip(bestCategory)
  };
}

function classifyImageContent(filename: string, size: number, mimetype: string): ClassificationResult {
  // Basic heuristic classification based on filename and file properties
  const filenameLower = filename.toLowerCase();
  
  // Check filename for keywords
  for (const [category, keywords] of Object.entries(WASTE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (filenameLower.includes(keyword)) {
        return {
          label: category as 'recyclable' | 'biodegradable' | 'hazardous',
          confidence: Math.round((Math.random() * 0.25 + 0.70) * 100) / 100,
          tip: getDisposalTip(category as 'recyclable' | 'biodegradable' | 'hazardous')
        };
      }
    }
  }

  // Default classification with random confidence for demo
  const categories: Array<'recyclable' | 'biodegradable' | 'hazardous'> = ['recyclable', 'biodegradable', 'hazardous'];
  const weights = [0.6, 0.3, 0.1]; // More likely to be recyclable
  const randomValue = Math.random();
  let cumulativeWeight = 0;
  let selectedCategory: 'recyclable' | 'biodegradable' | 'hazardous' = 'recyclable';

  for (let i = 0; i < categories.length; i++) {
    cumulativeWeight += weights[i];
    if (randomValue <= cumulativeWeight) {
      selectedCategory = categories[i];
      break;
    }
  }

  return {
    label: selectedCategory,
    confidence: Math.round((Math.random() * 0.25 + 0.70) * 100) / 100,
    tip: getDisposalTip(selectedCategory)
  };
}

function getDisposalTip(category: 'recyclable' | 'biodegradable' | 'hazardous'): string {
  const tips = {
    recyclable: "Clean the item and place it in the recycling bin. Remove any non-recyclable parts like caps or labels if possible.",
    biodegradable: "Compost this item in your garden compost bin or municipal composting facility. It will break down naturally and enrich the soil.",
    hazardous: "Take this item to a specialized hazardous waste collection center. Do not put it in regular trash as it can harm the environment."
  };
  return tips[category];
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'EcoSort AI Waste Classifier',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // Text classification endpoint
  app.post('/api/classify-text', async (req, res) => {
    try {
      const { text } = classifyTextSchema.parse(req.body);
      
      const result = classifyTextContent(text);

      res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          error: 'Validation error', 
          details: error.errors 
        });
      } else {
        console.error('Text classification error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  // Image classification endpoint
  app.post('/api/classify-image', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      const validatedData = classifyImageSchema.parse({
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });

      const result = classifyImageContent(
        validatedData.filename,
        validatedData.size,
        validatedData.mimetype
      );

      res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ 
          error: 'Validation error', 
          details: error.errors 
        });
      } else {
        console.error('Image classification error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
