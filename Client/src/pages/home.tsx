import { useState } from "react";
import Navigation from "@/components/navigation";
import ImageUpload from "@/components/image-upload";
import TextClassifier from "@/components/text-classifier";
import ClassificationResult from "@/components/classification-result";
import EducationalTips from "@/components/educational-tips";
import { ClassificationResult as ClassificationResultType } from "@shared/schema";

export default function Home() {
  const [classificationResult, setClassificationResult] = useState<ClassificationResultType | null>(null);

  const handleClassificationResult = (result: ClassificationResultType) => {
    setClassificationResult(result);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Smart Waste Classification for a{" "}
            <span className="text-primary">Sustainable Future</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Upload an image or describe your waste item, and our AI will classify it as Recyclable, Biodegradable, or Hazardous with disposal recommendations.
          </p>
        </div>

        {/* Classification Interface */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <ImageUpload onResult={handleClassificationResult} />
          <TextClassifier onResult={handleClassificationResult} />
        </div>

        {/* Classification Results */}
        {classificationResult && (
          <ClassificationResult result={classificationResult} />
        )}

        {/* Educational Tips */}
        <EducationalTips />
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <i className="fas fa-recycle text-primary-foreground text-lg"></i>
                </div>
                <h3 className="text-xl font-bold text-foreground">EcoSort</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                AI-powered waste classification for better environmental impact and proper waste disposal.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Features</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Image Classification</li>
                <li>Text Analysis</li>
                <li>Disposal Tips</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Recycling Guide</li>
                <li>Environmental Impact</li>
                <li>Contact Support</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 mt-8 text-center text-muted-foreground">
            <p>&copy; 2025 EcoSort Team. MIT License.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
