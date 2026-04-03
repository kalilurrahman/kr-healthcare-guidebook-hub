import { useState } from "react";
import { Search, Menu, X, Heart, BookOpen, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavItem {
  id: string;
  label: string;
}

interface HealthcareHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeSection: string;
  onSectionChange: (id: string) => void;
  navItems: NavItem[];
}

export function HealthcareHeader({ searchQuery, onSearchChange, activeSection, onSectionChange, navItems }: HealthcareHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header-glass sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => onSectionChange("overview")} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-sm font-bold text-foreground leading-tight">Healthcare GCC</h1>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">DX Handbook</p>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`nav-pill text-xs ${activeSection === item.id ? "active" : ""}`}
              >
                {item.label}
              </button>
            ))}
            <Link to="/reader" className="nav-pill text-xs flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Reader
            </Link>
            <Link to="/gcc-metrics" className="nav-pill text-xs flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              Metrics
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search chapters..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="search-input-pharma pl-10 w-48 lg:w-56"
              />
            </div>
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-2 max-h-[60vh] overflow-y-auto">
            <div className="relative sm:hidden mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search chapters..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="search-input-pharma pl-10"
              />
            </div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`nav-pill w-full text-left text-xs ${activeSection === item.id ? "active" : ""}`}
              >
                {item.label}
              </button>
            ))}
            <Link
              to="/reader"
              className="nav-pill w-full text-left text-xs flex items-center gap-1.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Online Reader
            </Link>
            <Link
              to="/gcc-metrics"
              className="nav-pill w-full text-left text-xs flex items-center gap-1.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              GCC Metrics
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
