import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Keyboard, Brain, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { ClassificationResult } from "@shared/schema";

interface TextClassifierProps {
  onResult: (result: ClassificationResult) => void;
}

export default function TextClassifier({ onResult }: TextClassifierProps) {
  const [text, setText] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const classifyTextMutation = useMutation({
    mutationFn: async (description: string) => {
      const response = await apiRequest('POST', '/api/classify-text', { text: description });
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
        description: error.message || "Failed to classify text",
      });
    },
  });

  const handleClassify = () => {
    if (!text.trim()) {
      toast({
        variant: "destructive",
        title: "No Description",
        description: "Please enter a description of your waste item",
      });
      return;
    }
    
    classifyTextMutation.mutate(text.trim());
  };

  const handleClear = () => {
    setText("");
  };

  const handleExampleClick = (example: string) => {
    setText(example);
  };

  const examples = ["plastic bottle", "banana peel", "old battery"];

  return (
    <Card data-testid="text-classifier-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Keyboard className="h-5 w-5 text-primary" />
          <span>Text Description</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Describe your waste item (e.g., 'plastic water bottle', 'banana peel', 'old battery')"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="h-32 resize-none"
          maxLength={500}
          data-testid="text-input"
        />
        
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Quick examples:</span>
          {examples.map((example) => (
            <Button
              key={example}
              variant="secondary"
              size="sm"
              onClick={() => handleExampleClick(example)}
              className="text-xs"
              data-testid={`example-${example.replace(/\s+/g, '-')}`}
            >
              {example}
            </Button>
          ))}
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handleClassify}
            disabled={!text.trim() || classifyTextMutation.isPending}
            className="flex-1"
            data-testid="classify-text-button"
          >
            {classifyTextMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                Classifying...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Classify Text
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={!text.trim()}
            data-testid="clear-text-button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
