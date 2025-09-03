import { useQuery } from "@tanstack/react-query";
import PixelCharacter from "./pixel-character";
import type { UserStats } from "@shared/schema";

export default function StatsDashboard() {
  // For demo purposes, using anonymous user stats
  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ["/api/stats", "anonymous"],
    retry: false,
  });

  // Default stats for when no data is available
  const displayStats = stats || {
    recycled: 142,
    composted: 89,
    hazardous: 12,
    total: 243,
    level: 5,
  };

  if (isLoading) {
    return (
      <section className="mt-16">
        <div className="text-center">
          <PixelCharacter type="ai" size="large" animation="spin" />
          <p className="pixel-font text-sm text-primary mt-4">LOADING STATS...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16">
      <h2 className="text-3xl pixel-font text-center text-primary mb-12" data-testid="stats-title">
        PLAYER STATS
      </h2>
      
      <div className="result-card p-8 max-w-3xl mx-auto" data-testid="stats-card">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <PixelCharacter 
              type="recyclable" 
              size="medium" 
              animation="wiggle"
              className="mx-auto mb-3"
              data-testid="stats-recyclable-character"
            />
            <p className="text-2xl pixel-font text-green-400" data-testid="stats-recycled">
              {displayStats.recycled}
            </p>
            <p className="text-xs pixel-font text-accent">RECYCLED</p>
          </div>
          
          <div className="text-center">
            <PixelCharacter 
              type="biodegradable" 
              size="medium" 
              animation="bounce"
              className="mx-auto mb-3"
              data-testid="stats-biodegradable-character"
            />
            <p className="text-2xl pixel-font text-yellow-400" data-testid="stats-composted">
              {displayStats.composted}
            </p>
            <p className="text-xs pixel-font text-accent">COMPOSTED</p>
          </div>
          
          <div className="text-center">
            <PixelCharacter 
              type="hazardous" 
              size="medium" 
              animation="wiggle"
              className="mx-auto mb-3"
              data-testid="stats-hazardous-character"
            />
            <p className="text-2xl pixel-font text-red-400" data-testid="stats-hazardous">
              {displayStats.hazardous}
            </p>
            <p className="text-xs pixel-font text-accent">HAZARDOUS</p>
          </div>
          
          <div className="text-center">
            <PixelCharacter 
              type="mascot" 
              size="medium" 
              animation="bounce"
              className="mx-auto mb-3"
              data-testid="stats-total-character"
            />
            <p className="text-2xl pixel-font text-primary" data-testid="stats-total">
              {displayStats.total}
            </p>
            <p className="text-xs pixel-font text-accent">TOTAL</p>
          </div>
        </div>
        
        {/* Achievement badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/20 border-2 border-accent px-4 py-2" data-testid="achievement-badge">
            <div className="w-6 h-6 bg-accent relative">
              <div className="absolute inset-0 bg-primary w-2 h-2 top-2 left-2"></div>
            </div>
            <span className="pixel-font text-xs text-accent" data-testid="achievement-level">
              ECO WARRIOR LEVEL {displayStats.level || 1}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
