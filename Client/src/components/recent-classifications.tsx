import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, FileText, Image, Recycle, Leaf, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { Classification } from "@shared/schema";

export default function RecentClassifications() {
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
        return 'text-blue-600';
      case 'biodegradable':
        return 'text-green-600';
      case 'hazardous':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <Card className="shadow-sm mb-12" data-testid="recent-classifications">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5 text-primary" />
            <span>Recent Classifications</span>
          </CardTitle>
          <Link href="/history">
            <Button variant="ghost" size="sm" data-testid="view-all-button">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 animate-pulse" data-testid={`skeleton-item-${i}`}>
                <div className="w-12 h-12 bg-muted rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="w-20 h-6 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : !classifications || classifications.length === 0 ? (
          <div className="text-center py-8" data-testid="empty-state">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No classifications yet. Start by uploading an image or entering text above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {classifications.slice(0, 3).map((classification) => (
              <div 
                key={classification.id} 
                className="flex items-center space-x-4 p-3 hover:bg-muted/50 rounded-lg transition-colors"
                data-testid={`classification-item-${classification.id}`}
              >
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  {classification.method === 'image' ? (
                    <Image className="h-6 w-6 text-muted-foreground" />
                  ) : (
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-card-foreground truncate" data-testid={`item-name-${classification.id}`}>
                    {classification.itemDescription.replace('Image: ', '')}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid={`item-time-${classification.id}`}>
                    {formatTimeAgo(new Date(classification.createdAt))}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border">
                    {getCategoryIcon(classification.classifiedAs)}
                  </div>
                  <span 
                    className={`text-sm font-medium ${getCategoryColor(classification.classifiedAs)}`}
                    data-testid={`item-category-${classification.id}`}
                  >
                    {classification.classifiedAs}
                  </span>
                  <span className="text-xs text-muted-foreground" data-testid={`item-confidence-${classification.id}`}>
                    {Math.round(classification.confidence * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
