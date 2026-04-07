import { motion } from "framer-motion";
import { Download, FileText, File, Star, Table2, FileSpreadsheet } from "lucide-react";

interface ResourceItem {
  name: string;
  filename: string;
  type: string;
  size: string;
  description: string;
  primary?: boolean;
  isLink?: boolean;
}

const resources: ResourceItem[] = [
  {
    name: "Healthcare DX Handbook — Online Reader",
    filename: "/reader",
    type: "html",
    size: "23 Chapters · 9 Parts",
    description: "Interactive React-based reader with sidebar navigation, part/chapter toggles, KPI tables, executive summaries, and reading progress — fully responsive across devices.",
    primary: true,
    isLink: true,
  },
  {
    name: "Healthcare DX Handbook 2026 — Standalone HTML",
    filename: "Healthcare_DX_Handbook_2026.html",
    type: "html",
    size: "~1.8 MB",
    description: "Self-contained single-file HTML reader with 23 chapters, sidebar navigation, and embedded styling — zero dependencies, works offline.",
  },
  {
    name: "Healthcare DX Handbook 2026 — PDF Edition",
    filename: "Healthcare_DX_Handbook_2026.pdf",
    type: "pdf",
    size: "76 Pages",
    description: "Print-ready PDF with all 23 chapters, 12 embedded diagrams, KPI tables, and executive summaries for offline reading and distribution.",
  },
  {
    name: "Healthcare DX Handbook 2026 — DOCX Edition",
    filename: "Healthcare_DX_Handbook_2026.docx",
    type: "docx",
    size: "~3 MB",
    description: "Editable Word document with full handbook content — ideal for annotation, internal distribution, and customisation.",
  },
  {
    name: "Healthcare Business Capability Map v3 — Full Edition",
    filename: "Healthcare_BCM_v3_Full_Edition.xlsx",
    type: "xlsx",
    size: "7 Domains · 36 Processes",
    description: "Comprehensive healthcare business capability matrix with capability areas, processes, technology players, maturity ratings, and competitive landscape across enterprise, mid-size, niche, payer, and digital-first segments.",
  },
  {
    name: "Healthcare GCC Handbook — Comprehensive DOCX",
    filename: "KR_HC_GG.docx",
    type: "docx",
    size: "~3 MB",
    description: "Full editable Word document with all 60 strategic chapters across 8 volumes — tables, diagrams, and executive summaries for annotation and internal distribution.",
  },
];

const iconMap: Record<string, React.ReactNode> = {
  html: <FileText className="w-6 h-6" />,
  docx: <File className="w-6 h-6" />,
  pdf: <FileText className="w-6 h-6" />,
  xlsx: <FileSpreadsheet className="w-6 h-6" />,
  zip: <File className="w-6 h-6" />,
};

const colorMap: Record<string, string> = {
  html: "text-primary",
  docx: "text-indigo",
  pdf: "text-coral",
  xlsx: "text-green-600 dark:text-green-400",
  zip: "text-gold",
};

export function ResourcesSection() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">📥 Downloadable Resources</h2>
        <p className="font-body text-muted-foreground">
          Download the full handbook in multiple formats. The Online Reader is the canonical, always-current edition. All resources are curated and maintained by Kalilur Rahman.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {resources.map((res, i) => (
          <motion.a
            key={res.filename}
            href={res.isLink ? res.filename : `/resources/${res.filename}`}
            {...(res.isLink ? {} : { download: true })}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`card-pharma group flex flex-col gap-4 no-underline ${res.primary ? "border-primary/50 ring-1 ring-primary/20 sm:col-span-2" : ""}`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg bg-muted ${colorMap[res.type] ?? "text-primary"}`}>
                {iconMap[res.type] ?? <File className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
                    {res.type.toUpperCase()} · {res.size}
                  </span>
                  {res.primary && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-mono font-bold uppercase">
                      <Star className="w-2.5 h-2.5" /> Primary
                    </span>
                  )}
                </div>
                <h3 className="font-display text-base font-semibold text-foreground mb-1 leading-tight">
                  {res.name}
                </h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">
                  {res.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-primary font-mono text-xs group-hover:translate-x-1 transition-transform">
              <Download className="w-3.5 h-3.5" />
              {res.isLink ? "Open Reader" : `Download ${res.type.toUpperCase()}`}
            </div>
          </motion.a>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-xl border border-border bg-muted/30">
        <p className="font-mono text-xs text-muted-foreground">
          📖 Curated by{" "}
          <a href="https://kalilurrahman.lovable.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Kalilur Rahman
          </a>
          {" "}· Healthcare GCC &amp; Digital Transformation Handbook — Comprehensive Edition 2025–2026
        </p>
      </div>
    </div>
  );
}
