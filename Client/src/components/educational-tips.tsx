import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Recycle, Leaf, AlertTriangle, ArrowRight } from "lucide-react";

export default function EducationalTips() {
  const tips = [
    {
      title: "Recycling Tips",
      description: "Clean containers before recycling. Remove caps and labels when possible. Check local recycling guidelines.",
      icon: Recycle,
      bgGradient: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      textColor: "text-blue-900",
      buttonColor: "text-blue-600 hover:text-blue-800",
      iconBg: "bg-blue-600",
    },
    {
      title: "Composting Guide",
      description: "Create nutrient-rich soil with organic waste. Mix browns and greens for optimal decomposition.",
      icon: Leaf,
      bgGradient: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      textColor: "text-green-900",
      buttonColor: "text-green-600 hover:text-green-800",
      iconBg: "bg-green-600",
    },
    {
      title: "Hazardous Disposal",
      description: "Never put hazardous items in regular trash. Find certified disposal centers in your area.",
      icon: AlertTriangle,
      bgGradient: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      textColor: "text-orange-900",
      buttonColor: "text-orange-600 hover:text-orange-800",
      iconBg: "bg-orange-600",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      {tips.map((tip, index) => {
        const Icon = tip.icon;
        
        return (
          <Card 
            key={tip.title}
            className={`bg-gradient-to-br ${tip.bgGradient} border ${tip.borderColor} shadow-sm`}
            data-testid={`tip-card-${index}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 ${tip.iconBg} rounded-full flex items-center justify-center`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h4 className={`text-lg font-semibold ${tip.textColor}`} data-testid={`tip-title-${index}`}>
                  {tip.title}
                </h4>
              </div>
              <p className={`${tip.textColor} text-sm mb-4 opacity-90`} data-testid={`tip-description-${index}`}>
                {tip.description}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`${tip.buttonColor} transition-colors p-0 h-auto font-medium`}
                data-testid={`tip-button-${index}`}
              >
                Learn More 
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
