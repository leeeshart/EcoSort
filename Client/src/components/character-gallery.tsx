import PixelCharacter from "./pixel-character";

export default function CharacterGallery() {
  const characters = [
    { type: "recyclable" as const, name: "RECYCLE", theme: "recyclable-theme", color: "text-green-400" },
    { type: "biodegradable" as const, name: "COMPOST", theme: "biodegradable-theme", color: "text-yellow-400" },
    { type: "hazardous" as const, name: "HAZARD", theme: "hazardous-theme", color: "text-red-400" },
    { type: "ai" as const, name: "AI HELPER", theme: "border-purple-500", color: "text-purple-400" },
    { type: "camera" as const, name: "SCANNER", theme: "border-blue-500", color: "text-blue-400" },
    { type: "earth" as const, name: "WARRIOR", theme: "border-green-400", color: "text-green-400" },
    { type: "education" as const, name: "GUIDE", theme: "border-orange-500", color: "text-orange-400" },
    { type: "speed" as const, name: "PLANET", theme: "border-cyan-500", color: "text-cyan-400" }
  ];

  return (
    <section className="mt-16">
      <h2 className="text-3xl pixel-font text-center text-primary mb-12" data-testid="gallery-title">
        MEET YOUR ECO HELPERS
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 max-w-4xl mx-auto">
        {characters.map((character, index) => (
          <div key={character.name} className={`result-card ${character.theme} p-3 text-center`} data-testid={`character-card-${index}`}>
            <PixelCharacter 
              type={character.type} 
              size="large" 
              animation={index % 2 === 0 ? "bounce" : "wiggle"}
              className="mx-auto mb-2"
              data-testid={`gallery-character-${character.name.toLowerCase()}`}
            />
            <p className={`pixel-font text-xs ${character.color}`} data-testid={`character-name-${index}`}>
              {character.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
