import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, CloudUpload, X, Search } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { ClassificationResult } from "@shared/schema";

interface ImageUploadProps {
  onResult: (result: ClassificationResult) => void;
}

export default function ImageUpload({ onResult }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const classifyImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await apiRequest('POST', '/api/classify-image', formData);
      return response.json();
    },
    onSuccess: (result: ClassificationResult) => {
      onResult(result);
      toast({
        title: "Classification Complete",
        description: `Classified as ${result.label} with ${Math.round(result.confidence * 100)}% confidence`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Classification Failed",
        description: error.message || "Failed to classify image",
      });
    },
  });

  const handleFileSelect = useCallback((file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please select a JPEG, PNG, GIF, or WebP image",
      });
      return;
    }

    // Validate file size (16MB)
    if (file.size > 16 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Please select an image smaller than 16MB",
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleClassify = () => {
    if (selectedFile) {
      classifyImageMutation.mutate(selectedFile);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <Card data-testid="image-upload-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Camera className="h-5 w-5 text-primary" />
          <span>Image Classification</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
            ${isDragging 
              ? 'border-primary bg-muted/50 scale-105' 
              : 'border-border hover:border-primary hover:bg-muted/50'
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('file-input')?.click()}
          data-testid="upload-zone"
        >
          {previewUrl ? (
            <div className="space-y-4">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-48 mx-auto rounded-lg object-cover"
                data-testid="image-preview"
              />
              <p className="text-sm text-muted-foreground">{selectedFile?.name}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <CloudUpload className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium text-card-foreground">Drop your image here</p>
                <p className="text-sm text-muted-foreground">or click to browse files</p>
              </div>
              <div className="text-xs text-muted-foreground">
                Supports: PNG, JPG, JPEG, WebP (Max 16MB)
              </div>
            </div>
          )}
          
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileInput}
            data-testid="file-input"
          />
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handleClassify}
            disabled={!selectedFile || classifyImageMutation.isPending}
            className="flex-1"
            data-testid="classify-image-button"
          >
            {classifyImageMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                Classifying...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Classify Image
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={!selectedFile}
            data-testid="clear-image-button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
