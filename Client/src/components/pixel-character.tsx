import { cn } from "@/lib/utils";

interface PixelCharacterProps {
  type: "mascot" | "recycling-robot" | "camera" | "text" | "recyclable" | "biodegradable" | "hazardous" | "ai" | "speed" | "education" | "earth";
  size?: "small" | "medium" | "large" | "xl";
  animation?: "bounce" | "wiggle" | "spin" | "none";
  className?: string;
  onClick?: () => void;
  "data-testid"?: string;
}

export default function PixelCharacter({ 
  type, 
  size = "medium", 
  animation = "none", 
  className, 
  onClick,
  "data-testid": testId 
}: PixelCharacterProps) {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
    xl: "w-24 h-24"
  };

  const animationClasses = {
    bounce: "character-bounce",
    wiggle: "character-wiggle",
    spin: "spin-animation",
    none: ""
  };

  const getCharacterDesign = () => {
    switch (type) {
      case "mascot":
        return (
          <div className={cn("bg-primary relative", sizeClasses[size])}>
            <div className="absolute inset-0 bg-accent w-2/3 h-2/3 top-1/6 left-1/6"></div>
            <div className="absolute inset-0 bg-destructive w-1/6 h-1/6 top-1/4 left-1/4"></div>
            <div className="absolute inset-0 bg-destructive w-1/6 h-1/6 top-1/4 right-1/4"></div>
            <div className="absolute inset-0 bg-foreground w-1/2 h-1/6 bottom-1/4 left-1/4"></div>
          </div>
        );

      case "recycling-robot":
        return (
          <div className={cn("bg-primary relative", sizeClasses[size])}>
            <div className="absolute inset-0 bg-accent w-2/3 h-2/3 top-1/6 left-1/6"></div>
            <div className="absolute inset-0 bg-foreground w-1/8 h-1/8 top-1/4 left-1/4"></div>
            <div className="absolute inset-0 bg-foreground w-1/8 h-1/8 top-1/4 right-1/4"></div>
            <div className="absolute inset-0 bg-secondary w-1/2 h-1/6 bottom-1/6 left-1/4"></div>
          </div>
        );

      case "camera":
        return (
          <div className={cn("bg-secondary relative", sizeClasses[size])}>
            <div className="absolute inset-0 bg-foreground w-1/2 h-1/2 top-1/4 left-1/4"></div>
            <div className="absolute inset-0 bg-primary w-1/4 h-1/4 top-1/8 left-3/8"></div>
          </div>
        );

      case "text":
        return (
          <div className={cn("bg-accent relative", sizeClasses[size])}>
            <div className="absolute inset-0 bg-foreground w-1/4 h-3/4 top-1/8 left-1/8"></div>
            <div className="absolute inset-0 bg-foreground w-1/4 h-3/4 top-1/8 right-1/8"></div>
            <div className="absolute inset-0 bg-primary w-3/4 h-1/4 top-3/8 left-1/8"></div>
          </div>
        );

      case "recyclable":
        return (
          <div className={cn("bg-green-500 relative", sizeClasses[size])}>
            <div className="absolute inset-0 bg-green-300 w-1/2 h-1/2 top-1/4 left-1/4"></div>
            <div className="absolute inset-0 bg-white w-1/8 h-1/8 top-1/8 left-3/8"></div>
            <div className="absolute inset-0 bg-white w-1/8 h-1/8 top-1/8 right-3/8"></div>
            <div className="absolute inset-0 bg-green-700 w-3/4 h-1/8 bottom-1/4 left-1/8"></div>
            <div className="absolute inset-0 bg-white w-1/4 h-1/4 top-3/8 left-3/8 opacity-80"></div>
          </div>
        );

      case "biodegradable":
        return (
          <div className={cn("bg-yellow-600 relative", sizeClasses[size])}>
            <div className="absolute inset-0 bg-yellow-400 w-1/2 h-1/2 top-1/4 left-1/4"></div>
            <div className="absolute inset-0 bg-green-600 w-2/3 h-1/6 top-1/12 left-1/6"></div>
            <div className="absolute inset-0 bg-white w-1/8 h-1/8 top-1/3 left-1/4"></div>
            <div className="absolute inset-0 bg-white w-1/8 h-1/8 top-1/3 right-1/4"></div>
          </div>
        );

      case "hazardous":
        return (
          <div className={cn("bg-red-500 relative", sizeClasses[size])}>
            <div className="absolute inset-0 bg-red-300 w-1/2 h-1/2 top-1/4 left-1/4"></div>
            <div className="absolute inset-0 bg-yellow-400 w-1/6 h-1/3 top-1/6 left-5/12"></div>
            <div className="absolute inset-0 bg-white w-1/8 h-1/8 top-1/3 left-1/4"></div>
            <div className="absolute inset-0 bg-white w-1/8 h-1/8 top-1/3 right-1/4"></div>
          </div>
        );

      case "ai":
        return (
          <div className={cn("bg-purple-500 relative", sizeClasses[size])}>
            <div className="absolute inset-0 bg-purple-300 w-1/2 h-1/2 top-1/4 left-1/4"></div>
            <div className="absolute inset-0 bg-cyan-400 w-1/6 h-1/6 top-1/8 left-3/8"></div>
            <div className="absolute inset-0 bg-cyan-400 w-1/6 h-1/6 top-1/8 right-3/8"></div>
            <div className="absolute inset-0 bg-white w-1/2 h-1/8 bottom-1/4 left-1/4"></div>
          </div>
        );

      case "speed":
        return (
          <div className={cn("bg-blue-500 relative", sizeClasses[size])}>
            <div className="absolute inset-0 bg-blue-300 w-1/2 h-1/2 top-1/4 left-1/4"></div>
            <div className="absolute inset-0 bg-yellow-400 w-1/4 h-1/12 top-1/2 left-1/12"></div>
            <div className="absolute inset-0 bg-yellow-400 w-1/4 h-1/12 top-7/12 left-0"></div>
            <div className="absolute inset-0 bg-yellow-400 w-1/4 h-1/12 bottom-1/3 left-1/12"></div>
          </div>
        );

      case "education":
        return (
          <div className={cn("bg-orange-500 relative", sizeClasses[size])}>
            <div className="absolute inset-0 bg-orange-300 w-1/2 h-1/2 top-1/4 left-1/4"></div>
            <div className="absolute inset-0 bg-white w-1/6 h-1/6 top-1/8 left-3/8"></div>
            <div className="absolute inset-0 bg-white w-1/6 h-1/6 top-1/8 right-3/8"></div>
            <div className="absolute inset-0 bg-green-500 w-1/2 h-1/6 top-1/12 left-1/4"></div>
          </div>
        );

      case "earth":
        return (
          <div className={cn("bg-green-600 relative", sizeClasses[size])}>
            <div className="absolute inset-0 bg-green-400 w-1/2 h-1/2 top-1/4 left-1/4"></div>
            <div className="absolute inset-0 bg-blue-400 w-1/4 h-1/4 top-1/8 left-3/8"></div>
            <div className="absolute inset-0 bg-blue-400 w-1/6 h-1/3 top-1/2 right-1/8"></div>
            <div className="absolute inset-0 bg-white w-1/12 h-1/12 top-5/12 left-3/8"></div>
          </div>
        );

      default:
        return (
          <div className={cn("bg-primary relative", sizeClasses[size])}>
            <div className="absolute inset-0 bg-accent w-1/2 h-1/2 top-1/4 left-1/4"></div>
          </div>
        );
    }
  };

  return (
    <div 
      className={cn(
        "relative cursor-pointer select-none",
        animationClasses[animation],
        className
      )}
      onClick={onClick}
      data-testid={testId}
    >
      {getCharacterDesign()}
    </div>
  );
}
