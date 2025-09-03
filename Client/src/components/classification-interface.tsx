import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import PixelCharacter from "./pixel-character";
import { apiRequest } from "@/lib/queryClient";
import type { WasteClassification } from "@shared/schema";

interface ClassificationInterfaceProps {
  onClassificationResult: (result: WasteClassification) => void;
}

export default function ClassificationInterface({ onClassificationResult }: ClassificationInterfaceProps) {
  const [textDescription, setTextDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const classifyMutation = useMutation({
    mutationFn: async (data: { description: string; imageUrl?: string }) => {
      const response = await apiRequest("POST", "/api/classify", data);
      return response.json();
    },
    onSuccess: (result: WasteClassification) => {
      onClassificationResult(result);
      toast({
        title: "Classification Complete!",
        description: `Identified as ${result.category} with ${Math.round(result.confidence * 100)}% confidence`,
      });
    },
    onError: (error) => {
      toast({
        title: "Classification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 16 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 16MB",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // In production, upload to cloud storage and get URL
    // For now, use file name as description
    const description = `Image: ${file.name}`;
    
    try {
      classifyMutation.mutate({ description, imageUrl: file.name });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextClassification = () => {
    if (!textDescription.trim()) {
      toast({
        title: "No Description",
        description: "Please enter a description of your waste item",
        variant: "destructive",
      });
      return;
    }

    classifyMutation.mutate({ description: textDescription });
  };

  const setExample = (example: string) => {
    setTextDescription(example);
  };

  const isProcessing = classifyMutation.isPending || isLoading;

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Classification */}
        <div className="result-card p-6 glow">
          <div className="flex items-center gap-3 mb-6">
            <PixelCharacter 
              type="camera" 
              size="small" 
              animation="bounce"
              data-testid="camera-character"
            />
            <h2 className="text-xl pixel-font text-primary">IMAGE CLASSIFICATION</h2>
          </div>
          
          <div className="border-4 border-dashed border-primary bg-muted/20 p-8 text-center mb-4 relative">
            <PixelCharacter 
              type="ai" 
              size="large" 
              animation="bounce"
              className="mx-auto mb-4"
              data-testid="dropzone-character"
            />
            
            <p className="pixel-font text-xs text-accent mb-2">DROP YOUR IMAGE HERE</p>
            <p className="text-sm text-muted-foreground font-mono mb-4">or click to browse files</p>
            <p className="text-xs text-muted-foreground font-mono">Supports: PNG, JPG, JPEG, WebP (Max 16MB)</p>
            
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              onChange={handleImageUpload}
              accept="image/*"
              disabled={isProcessing}
              data-testid="input-image-upload"
            />
          </div>
          
          <button 
            className="pixel-button w-full py-3 pixel-font text-sm text-black hover:glow transition-all duration-200 disabled:opacity-50"
            onClick={() => handleImageUpload({ target: { files: [] } } as any)}
            disabled={isProcessing}
            data-testid="button-classify-image"
          >
            {isProcessing ? "PROCESSING..." : "CLASSIFY IMAGE"}
          </button>
        </div>

        {/* Text Classification */}
        <div className="result-card p-6 glow">
          <div className="flex items-center gap-3 mb-6">
            <PixelCharacter 
              type="text" 
              size="small" 
              animation="wiggle"
              data-testid="text-character"
            />
            <h2 className="text-xl pixel-font text-primary">TEXT DESCRIPTION</h2>
          </div>
          
          <textarea 
            className="pixel-input w-full h-32 p-4 text-sm font-mono resize-none mb-4"
            placeholder="Describe your waste item... (e.g., plastic bottle, banana peel, old battery)"
            value={textDescription}
            onChange={(e) => setTextDescription(e.target.value)}
            disabled={isProcessing}
            data-testid="textarea-description"
          />
          
          <div className="mb-4">
            <p className="text-xs pixel-font text-accent mb-3">QUICK EXAMPLES:</p>
            <div className="flex flex-wrap gap-2">
              <button 
                className="bg-muted/40 border-2 border-primary px-3 py-1 text-xs font-mono hover:bg-primary/20 transition-colors disabled:opacity-50"
                onClick={() => setExample("plastic bottle")}
                disabled={isProcessing}
                data-testid="example-plastic-bottle"
              >
                plastic bottle
              </button>
              <button 
                className="bg-muted/40 border-2 border-primary px-3 py-1 text-xs font-mono hover:bg-primary/20 transition-colors disabled:opacity-50"
                onClick={() => setExample("banana peel")}
                disabled={isProcessing}
                data-testid="example-banana-peel"
              >
                banana peel
              </button>
              <button 
                className="bg-muted/40 border-2 border-primary px-3 py-1 text-xs font-mono hover:bg-primary/20 transition-colors disabled:opacity-50"
                onClick={() => setExample("old battery")}
                disabled={isProcessing}
                data-testid="example-old-battery"
              >
                old battery
              </button>
            </div>
          </div>
          
          <button 
            className="pixel-button w-full py-3 pixel-font text-sm text-black hover:glow transition-all duration-200 disabled:opacity-50"
            onClick={handleTextClassification}
            disabled={isProcessing || !textDescription.trim()}
            data-testid="button-classify-text"
          >
            {isProcessing ? "PROCESSING..." : "CLASSIFY TEXT"}
          </button>
        </div>
      </div>

      {/* Loading Modal */}
      {isProcessing && (
        <div className="fixed inset-0 bg-background/90 flex items-center justify-center z-50" data-testid="loading-modal">
          <div className="result-card p-8 text-center">
            <PixelCharacter 
              type="ai" 
              size="xl" 
              animation="spin"
              className="mx-auto mb-4"
              data-testid="loading-character"
            />
            <p className="pixel-font text-lg text-primary mb-2">ANALYZING...</p>
            <p className="text-sm font-mono text-muted-foreground">AI is processing your waste item</p>
          </div>
        </div>
      )}
    </>
  );
}
