import { motion } from "framer-motion";
import type { HealthcareChapter } from "@/types/healthcare.types";

interface ChapterCardProps {
  chapter: HealthcareChapter;
  onClick: () => void;
  index: number;
}

const tagColorMap: Record<string, string> = {
  Strategy: "border-t-primary",
  Finance: "border-t-gold",
  Payer: "border-t-violet",
  Provider: "border-t-teal",
  RCM: "border-t-coral",
  Digital: "border-t-indigo",
  PBM: "border-t-gold",
  VBC: "border-t-teal",
  Care: "border-t-violet",
  GCC: "border-t-primary",
  AI: "border-t-indigo",
  Analytics: "border-t-gold",
  Specialty: "border-t-coral",
  Operations: "border-t-teal",
  Compliance: "border-t-violet",
  Diagnostics: "border-t-gold",
  Surgical: "border-t-coral",
  Genomics: "border-t-indigo",
};

export function ChapterCard({ chapter, onClick, index }: ChapterCardProps) {
  const borderColor = tagColorMap[chapter.tag] ?? "border-t-primary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
      onClick={onClick}
      className={`card-pharma border-t-[3px] ${borderColor}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 font-mono text-xs text-primary font-bold">
          {chapter.num}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-muted-foreground">{chapter.volumeLabel}</span>
          <span className="tag-pill text-[10px]">{chapter.tag}</span>
        </div>
      </div>

      <h3 className="font-display text-base font-semibold text-foreground mb-2 leading-tight">{chapter.title}</h3>
      <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{chapter.teaser}</p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {chapter.stats.map((s) => (
          <div key={s.l} className="stat-gradient-bg rounded-lg p-2 text-center">
            <div className="font-display text-sm font-bold text-primary">{s.v}</div>
            <div className="font-mono text-[9px] text-muted-foreground uppercase">{s.l}</div>
          </div>
        ))}
      </div>

      <button className="font-mono text-xs text-primary hover:text-teal-light transition-colors flex items-center gap-1">
        Read Chapter →
      </button>
    </motion.div>
  );
}
