import PixelCharacter from "./pixel-character";

export default function EducationalTips() {
  const tips = [
    {
      id: "recycling",
      character: "recyclable" as const,
      title: "RECYCLING",
      description: "Clean containers before recycling. Remove caps and labels when possible. Check local recycling guidelines.",
      theme: "recyclable-theme",
      color: "text-green-400"
    },
    {
      id: "composting",
      character: "biodegradable" as const,
      title: "COMPOSTING",
      description: "Create nutrient-rich soil with organic waste. Mix browns and greens for optimal decomposition.",
      theme: "biodegradable-theme",
      color: "text-yellow-400"
    },
    {
      id: "hazardous",
      character: "hazardous" as const,
      title: "HAZARDOUS",
      description: "Never put hazardous items in regular trash. Find certified disposal centers in your area.",
      theme: "hazardous-theme",
      color: "text-red-400"
    }
  ];

  return (
    <section className="mt-16">
      <h2 className="text-3xl pixel-font text-center text-primary mb-12" data-testid="educational-title">
        WASTE MANAGEMENT GUIDE
      </h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        {tips.map((tip) => (
          <div key={tip.id} className={`result-card ${tip.theme} p-6`} data-testid={`tip-card-${tip.id}`}>
            <div className="flex items-center gap-3 mb-4">
              <PixelCharacter 
                type={tip.character} 
                size="medium" 
                animation="bounce"
                data-testid={`tip-character-${tip.id}`}
              />
              <h3 className={`pixel-font text-lg ${tip.color}`}>{tip.title}</h3>
            </div>
            <p className="text-sm font-mono text-foreground leading-relaxed mb-4" data-testid={`tip-description-${tip.id}`}>
              {tip.description}
            </p>
            <button 
              className="pixel-button px-4 py-2 pixel-font text-xs text-black w-full"
              data-testid={`button-learn-more-${tip.id}`}
            >
              LEARN MORE
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
