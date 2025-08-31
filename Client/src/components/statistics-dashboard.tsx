import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Recycle, Leaf, AlertTriangle } from "lucide-react";

interface StatsData {
  total: number;
  recyclable: number;
  biodegradable: number;
  hazardous: number;
}

export default function StatisticsDashboard() {
  const { data: stats, isLoading } = useQuery<StatsData>({
    queryKey: ['/api/stats'],
  });

  const statCards = [
    {
      title: "Items Classified",
      value: stats?.total || 0,
      icon: BarChart3,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Recyclable Items",
      value: stats?.recyclable || 0,
      icon: Recycle,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Biodegradable Items",
      value: stats?.biodegradable || 0,
      icon: Leaf,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Hazardous Items",
      value: stats?.hazardous || 0,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-12">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <Card key={stat.title} className="shadow-sm" data-testid={`stat-card-${index}`}>
            <CardContent className="p-6 text-center">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <Icon className={`${stat.color} text-xl h-6 w-6`} />
              </div>
              <div className="text-2xl font-bold text-foreground" data-testid={`stat-value-${index}`}>
                {isLoading ? (
                  <div className="w-12 h-8 bg-muted rounded animate-pulse mx-auto"></div>
                ) : (
                  stat.value.toLocaleString()
                )}
              </div>
              <p className="text-sm text-muted-foreground" data-testid={`stat-title-${index}`}>
                {stat.title}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
