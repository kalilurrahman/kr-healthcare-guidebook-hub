import { motion } from "framer-motion";
import type { HealthcareChapter } from "@/types/healthcare.types";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ChapterViewerProps {
  chapter: HealthcareChapter;
  onBack: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function ChapterViewer({ chapter, onBack, onPrev, onNext, hasPrev, hasNext }: ChapterViewerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-4xl mx-auto"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-mono text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Overview
      </button>

      <div className="mb-12">
        <div className="font-mono text-xs text-primary tracking-wider uppercase mb-2">{chapter.volumeLabel}</div>
        <div className="font-mono text-xs text-muted-foreground mb-3">Chapter {chapter.num}</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">{chapter.title}</h1>
        <p className="font-body text-lg text-muted-foreground italic leading-relaxed max-w-2xl">{chapter.teaser}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-12">
        {chapter.stats.map((s) => (
          <div key={s.l} className="metric-card">
            <div className="font-display text-xl sm:text-2xl font-bold text-primary mb-1">{s.v}</div>
            <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="chapter-content space-y-8">
        <div className="rounded-xl p-6 my-7 bg-gradient-to-br from-gold/10 to-gold/5 border-l-4 border-l-gold">
          <div className="font-mono text-[10px] uppercase tracking-wider mb-3 text-primary font-bold">
            Strategic Perspective
          </div>
          <p className="font-body text-sm leading-relaxed text-muted-foreground italic">
            {chapter.content}
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">Operational Interventions</h2>
          <ul className="space-y-3">
            {chapter.actions.map((action, i) => (
              <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center font-mono text-xs text-primary font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="font-body text-sm text-muted-foreground">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-between items-center mt-16 pt-8 border-t border-border">
        {hasPrev ? (
          <button onClick={onPrev} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors text-sm font-body text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
            Previous Chapter
          </button>
        ) : <div />}
        {hasNext ? (
          <button onClick={onNext} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors text-sm font-body text-muted-foreground">
            Next Chapter
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : <div />}
      </div>
    </motion.div>
  );
}
