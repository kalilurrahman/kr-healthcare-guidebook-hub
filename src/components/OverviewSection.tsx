import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, BarChart3 } from "lucide-react";
import { healthcareVolumes, transformationPillars } from "@/data/healthcare-data";
import { ChapterCard } from "@/components/ChapterCard";

interface OverviewSectionProps {
  onChapterSelect: (chapterId: string) => void;
}

const industryStats = [
  { value: "$4.9T", label: "US NHE 2025", color: "text-primary" },
  { value: "8.9%", label: "EBITDA/NHE 2024", color: "text-coral" },
  { value: "8.7%", label: "2027 Projection", color: "text-gold" },
  { value: "60", label: "Strategic Chapters", color: "text-teal" },
  { value: "61", label: "RCM Playbooks", color: "text-indigo" },
  { value: "8", label: "Volumes", color: "text-violet" },
];

export function OverviewSection({ onChapterSelect }: OverviewSectionProps) {
  return (
    <div className="space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 sm:grid-cols-6 gap-px rounded-2xl overflow-hidden glass-card"
      >
        {industryStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            className="p-4 sm:p-5 text-center bg-background/5 backdrop-blur-sm"
          >
            <div className={`font-display text-lg sm:text-xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
            <div className="font-mono text-[8px] text-muted-foreground uppercase tracking-wider leading-tight">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-6">Digital Transformation Pillars</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {transformationPillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card-pharma"
            >
              <div className="text-2xl mb-2">{p.icon}</div>
              <h3 className="font-display text-sm font-bold text-foreground mb-1">{p.title}</h3>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/reader" className="card-pharma group flex items-center gap-4 no-underline hover:border-primary/50 transition-colors">
          <div className="p-3 rounded-lg bg-primary/10">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-sm font-bold text-foreground mb-0.5">📖 Online Reader</h3>
            <p className="font-body text-xs text-muted-foreground">Full 60-chapter handbook with sidebar navigation &amp; search</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
        <Link to="/gcc-metrics" className="card-pharma group flex items-center gap-4 no-underline hover:border-primary/50 transition-colors">
          <div className="p-3 rounded-lg bg-gold/10">
            <BarChart3 className="w-6 h-6 text-gold" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-sm font-bold text-foreground mb-0.5">📊 GCC Metrics</h3>
            <p className="font-body text-xs text-muted-foreground">Healthcare GCC benchmarks across key dimensions</p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 rounded-2xl overflow-x-auto">
        <h2 className="font-display text-lg font-bold text-foreground mb-4 text-center">Healthcare Digital Value Chain</h2>
        <svg viewBox="0 0 600 120" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-2xl mx-auto" style={{ minWidth: 400 }}>
          {[
            { x: 10, label: "Patient\nAccess", fill: "hsl(172,83%,32%)" },
            { x: 93, label: "Clinical\nCare", fill: "hsl(263,70%,58%)" },
            { x: 176, label: "Coding\n& CDI", fill: "hsl(244,58%,42%)" },
            { x: 259, label: "Claims\n& Billing", fill: "hsl(215,20%,65%)" },
            { x: 342, label: "Denials\nMgmt", fill: "hsl(38,90%,43%)" },
            { x: 425, label: "Payment\nPosting", fill: "hsl(346,84%,50%)" },
            { x: 508, label: "Analytics\n& AI", fill: "hsl(172,83%,32%)" },
          ].map((seg, i) => (
            <g key={i}>
              <polygon
                points={`${seg.x},10 ${seg.x + 78},10 ${seg.x + 88},45 ${seg.x + 78},80 ${seg.x},80 ${seg.x + 10},45`}
                fill={seg.fill}
                opacity={0.9}
              />
              {seg.label.split("\n").map((line, li) => (
                <text key={li} x={seg.x + 44} y={38 + li * 16} textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">
                  {line}
                </text>
              ))}
            </g>
          ))}
          <line x1="10" y1="100" x2="590" y2="100" stroke="hsl(172,83%,32%)" strokeWidth="2.5" />
          <text x="300" y="115" textAnchor="middle" fontSize="9" fill="hsl(172,83%,32%)" fontWeight="bold">
            UNIFIED DIGITAL THREAD · END-TO-END REVENUE CYCLE &amp; CARE MANAGEMENT
          </text>
        </svg>
      </motion.div>

      {healthcareVolumes.map((vol) => (
        <div key={vol.group}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">📘</span>
            <h2 className="font-display text-xl font-bold text-foreground">{vol.group}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vol.chapters.map((chapter, i) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                index={i}
                onClick={() => onChapterSelect(chapter.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
