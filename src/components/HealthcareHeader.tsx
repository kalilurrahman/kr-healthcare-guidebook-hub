import { useState } from "react";
import { Search, Menu, X, Heart, BookOpen, BarChart3, Layers, Download } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const topLinks = [
    { to: "/reader", icon: BookOpen, label: "Reader", color: "text-primary" },
    { to: "/gcc-metrics", icon: BarChart3, label: "Metrics", color: "text-gold" },
    { to: "/bcm", icon: Layers, label: "BCM", color: "text-indigo" },
  ];

  return (
    <header className="header-glass sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-sm font-bold text-foreground leading-tight">Healthcare GCC</h1>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">DX Handbook</p>
            </div>
          </Link>

          {/* Top-level section links - always visible on desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {topLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all no-underline ${
                    isActive
                      ? "gradient-bg text-primary-foreground"
                      : "border border-border hover:border-primary/50 text-foreground hover:text-primary"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={() => onSectionChange("resources")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeSection === "resources"
                  ? "gradient-bg text-primary-foreground"
                  : "border border-border hover:border-primary/50 text-foreground hover:text-primary"
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              Resources
            </button>
          </nav>

          {/* Volume nav - hidden on smaller screens, visible on lg */}
          <nav className="hidden lg:flex items-center gap-0.5 max-w-md overflow-x-auto scrollbar-hide">
            {navItems.filter(n => n.id !== "resources").slice(0, 5).map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`nav-pill text-[10px] px-3 py-1.5 ${activeSection === item.id ? "active" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="search-input-pharma pl-10 w-36 lg:w-48"
              />
            </div>
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 max-h-[60vh] overflow-y-auto">
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
            {topLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="nav-pill w-full text-left text-xs flex items-center gap-1.5 no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={() => { onSectionChange("resources"); setMobileMenuOpen(false); }}
              className={`nav-pill w-full text-left text-xs flex items-center gap-1.5 ${activeSection === "resources" ? "active" : ""}`}
            >
              <Download className="w-3.5 h-3.5" />
              Resources
            </button>
            <hr className="border-border" />
            {navItems.filter(n => n.id !== "resources").map((item) => (
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
          </div>
        )}
      </div>
    </header>
  );
}