import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Recycle, History, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const navItems = [
    { path: "/", label: "Classify", icon: Recycle },
  ];

  const NavLink = ({ item, onClick }: { item: typeof navItems[0]; onClick?: () => void }) => (
    <Link href={item.path} onClick={onClick}>
      <Button
        variant={isActive(item.path) ? "default" : "ghost"}
        className="w-full justify-start md:w-auto md:justify-center"
        data-testid={`nav-${item.label.toLowerCase()}`}
      >
        <item.icon className="h-4 w-4 md:mr-2" />
        <span className="md:inline">{item.label}</span>
      </Button>
    </Link>
  );

  return (
    <header className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center space-x-2" data-testid="logo">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Recycle className="text-primary-foreground text-lg" />
              </div>
              <h1 className="text-xl font-bold text-foreground">EcoSort</h1>
              <span className="text-sm text-muted-foreground hidden sm:inline">AI Waste Classifier</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </nav>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" data-testid="mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-2 mt-8">
                {navItems.map((item) => (
                  <NavLink key={item.path} item={item} onClick={() => setIsOpen(false)} />
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
