import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Image, Recycle, Leaf, AlertTriangle } from "lucide-react";
import { Classification } from "@shared/schema";

export default function History() {
  const { data: classifications, isLoading } = useQuery<Classification[]>({
    queryKey: ['/api/classifications'],
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'recyclable':
        return <Recycle className="h-4 w-4 text-blue-600" />;
      case 'biodegradable':
        return <Leaf className="h-4 w-4 text-green-600" />;
      case 'hazardous':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <Recycle className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'recyclable':
        return 'bg-blue-100 text-blue-800';
      case 'biodegradable':
        return 'bg-green-100 text-green-800';
      case 'hazardous':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((date.getTime() - Date.now()) / (1000 * 60)),
      'minute'
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Classification History</h1>
          <p className="text-muted-foreground">
            Review your past waste classifications and their disposal recommendations.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} data-testid={`skeleton-card-${i}`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-lg animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse"></div>
                      <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
                    </div>
                    <div className="w-20 h-6 bg-muted rounded animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !classifications || classifications.length === 0 ? (
          <Card data-testid="empty-state">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Classifications Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start classifying waste items to see your history here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {classifications.map((classification) => (
              <Card key={classification.id} data-testid={`classification-${classification.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      {classification.method === 'image' ? (
                        <Image className="h-6 w-6 text-muted-foreground" />
                      ) : (
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-foreground truncate" data-testid={`item-description-${classification.id}`}>
                          {classification.itemDescription}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {classification.method}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span data-testid={`timestamp-${classification.id}`}>
                            {formatDate(new Date(classification.createdAt))}
                          </span>
                        </div>
                        <span data-testid={`confidence-${classification.id}`}>
                          {Math.round(classification.confidence * 100)}% confidence
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-2" data-testid={`tip-${classification.id}`}>
                        {classification.disposalTip}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {getCategoryIcon(classification.classifiedAs)}
                      <Badge 
                        className={getCategoryColor(classification.classifiedAs)}
                        data-testid={`category-${classification.id}`}
                      >
                        {classification.classifiedAs}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
