import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Recycle, Leaf, AlertTriangle, Info } from "lucide-react";
import { ClassificationResult as ClassificationResultType } from "@shared/schema";

interface ClassificationResultProps {
  result: ClassificationResultType;
}

export default function ClassificationResult({ result }: ClassificationResultProps) {
  const categories = [
    {
      id: 'recyclable',
      name: 'Recyclable',
      icon: Recycle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      confidence: result.label === 'recyclable' ? result.confidence * 100 : 15,
    },
    {
      id: 'biodegradable',
      name: 'Biodegradable',
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      confidence: result.label === 'biodegradable' ? result.confidence * 100 : 10,
    },
    {
      id: 'hazardous',
      name: 'Hazardous',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      confidence: result.label === 'hazardous' ? result.confidence * 100 : 5,
    },
  ];

  const bestMatch = categories.find(cat => cat.id === result.label);

  const getStepInstructions = (label: string) => {
    switch (label) {
      case 'recyclable':
        return [
          "Remove the cap and label if possible",
          "Rinse the item to remove any residue",
          "Place in your recycling bin or take to a recycling center"
        ];
      case 'biodegradable':
        return [
          "Remove any non-organic materials",
          "Cut into smaller pieces for faster decomposition",
          "Add to your compost bin or garden compost"
        ];
      case 'hazardous':
        return [
          "Do not put in regular trash",
          "Store safely until disposal",
          "Take to a certified hazardous waste facility"
        ];
      default:
        return [];
    }
  };

  const getEnvironmentalTip = (label: string) => {
    switch (label) {
      case 'recyclable':
        return "Recycling one plastic bottle can save enough energy to power a 60-watt light bulb for 3 hours.";
      case 'biodegradable':
        return "Composting organic waste reduces methane emissions and creates nutrient-rich soil.";
      case 'hazardous':
        return "Proper hazardous waste disposal prevents soil and water contamination.";
      default:
        return "";
    }
  };

  return (
    <div className="classification-result animate-in slide-in-from-bottom-4 duration-500 mb-12">
      <Card data-testid="classification-results">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Classification Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Confidence Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              const isWinner = category.id === result.label;
              
              return (
                <div
                  key={category.id}
                  className={`
                    rounded-lg p-4 border transition-all duration-300
                    ${category.bgColor} ${category.borderColor}
                    ${isWinner ? 'ring-2 ring-offset-2 ring-primary scale-105' : 'opacity-60'}
                  `}
                  data-testid={`category-${category.id}`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${category.color} bg-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className={`font-semibold ${category.color}`}>{category.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {Math.round(category.confidence)}% Confidence
                      </p>
                    </div>
                  </div>
                  <Progress 
                    value={category.confidence} 
                    className="h-2 mb-3"
                    data-testid={`confidence-bar-${category.id}`}
                  />
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {category.id === 'recyclable' && "Clean the item and place it in the recycling bin."}
                    {category.id === 'biodegradable' && "Compost this item in your garden compost bin."}
                    {category.id === 'hazardous' && "Take this item to a specialized hazardous waste center."}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Best Match Details */}
          {bestMatch && (
            <Card className={`${bestMatch.bgColor} ${bestMatch.borderColor} border`} data-testid="best-match-details">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${bestMatch.color} bg-white`}>
                    <bestMatch.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-lg font-semibold mb-2 ${bestMatch.color}`}>
                      Best Match: {bestMatch.name}
                    </h4>
                    <p className="text-muted-foreground mb-4" data-testid="classification-description">
                      Your item has been classified as {result.label} with {Math.round(result.confidence * 100)}% confidence. 
                      Here's how to dispose of it properly:
                    </p>
                    
                    <div className="space-y-3">
                      {getStepInstructions(result.label).map((instruction, index) => (
                        <div key={index} className="flex items-start space-x-3" data-testid={`step-${index + 1}`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white mt-0.5 ${bestMatch.color} bg-current`}>
                            {index + 1}
                          </div>
                          <p className="text-sm text-muted-foreground">{instruction}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-white rounded-md border border-current border-opacity-20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Info className={`h-4 w-4 ${bestMatch.color}`} />
                        <span className={`text-sm font-medium ${bestMatch.color}`}>Environmental Impact</span>
                      </div>
                      <p className="text-xs text-muted-foreground" data-testid="environmental-tip">
                        {getEnvironmentalTip(result.label)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
