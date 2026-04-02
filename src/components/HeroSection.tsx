import { motion } from "framer-motion";
import { BookOpen, Layers } from "lucide-react";

export function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="gradient-hero relative overflow-hidden min-h-[85vh] flex flex-col items-center justify-center px-6 py-20">
      {/* Hexagonal mesh pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hex" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
              <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex)" />
        </svg>
      </div>

      {/* Animated dots */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-pulse-dot" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-primary rounded-full animate-pulse-dot" style={{ animationDelay: "0.5s" }} />
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-secondary rounded-full animate-pulse-dot" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-primary rounded-full animate-pulse-dot" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-40 right-10 w-3 h-3 bg-secondary rounded-full animate-pulse-dot" style={{ animationDelay: "0.7s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-8">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-dot" />
          <span className="font-mono text-xs text-primary tracking-wider uppercase">Comprehensive Edition · 2025–2026</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
          <span className="gradient-text">Healthcare GCC</span> &amp;
          <br />RCM Transformation Handbook
        </h1>

        <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
          The definitive operating playbook for healthcare executives, GCC leaders, and revenue cycle professionals — spanning provider, payer, PBM, population health, and AI-enabled capability centers.
        </p>

        <p className="font-mono text-sm text-muted-foreground mb-10">
          By Kalilur Rahman · Global IT Executive · AI Thought Leader · Kaggle Legacy Grandmaster
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={() => scrollTo("online-reader")}
            className="px-8 py-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2"
            style={{ background: "hsl(var(--primary))", color: "white" }}
          >
            <BookOpen className="w-4 h-4" />
            Read Online
          </button>
          <button
            onClick={() => scrollTo("strategic-chapters")}
            className="px-8 py-3 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 border border-primary text-primary hover:bg-primary/10"
          >
            <Layers className="w-4 h-4" />
            Explore Chapters
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px max-w-xl mx-auto rounded-2xl overflow-hidden glass-card">
          {[
            { value: "30", label: "Strategic Chapters" },
            { value: "61", label: "RCM Deep Dives" },
            { value: "India-First", label: "GCC Context" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="p-6 text-center bg-background/5 backdrop-blur-sm"
            >
              <div className="font-display text-2xl sm:text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 mt-10">
          <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center font-display text-lg font-bold text-primary-foreground">
            KR
          </div>
          <div className="text-left">
            <div className="font-display text-foreground font-semibold">Kalilur Rahman</div>
            <div className="font-body text-xs text-muted-foreground">Global IT Executive · AI Thought Leader · Kaggle Legacy Grandmaster</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
