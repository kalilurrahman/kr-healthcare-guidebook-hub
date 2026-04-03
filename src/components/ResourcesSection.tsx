import { motion } from "framer-motion";
import { Download, FileText, File, Star } from "lucide-react";

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
    name: "Healthcare GCC Handbook — Online Reader (HTML)",
    filename: "/reader",
    type: "html",
    size: "60 Chapters",
    description: "The self-contained interactive HTML reader with all 60 strategic chapters, sidebar navigation, search, and reading progress — zero dependencies required.",
    primary: true,
    isLink: true,
  },
  {
    name: "Healthcare GCC Handbook — Comprehensive DOCX",
    filename: "KR_HC_GG.docx",
    type: "docx",
    size: "~3 MB",
    description: "Full editable Word document with all 30 strategic chapters, tables, diagrams, and executive summaries for annotation and internal distribution.",
  },
];

const iconMap: Record<string, React.ReactNode> = {
  html: <FileText className="w-6 h-6" />,
  docx: <File className="w-6 h-6" />,
  pdf: <FileText className="w-6 h-6" />,
  zip: <File className="w-6 h-6" />,
};

const colorMap: Record<string, string> = {
  html: "text-primary",
  docx: "text-indigo",
  pdf: "text-coral",
  zip: "text-gold",
};

export function ResourcesSection() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">📥 Downloadable Resources</h2>
        <p className="font-body text-muted-foreground">
          Download the full handbook in multiple formats. The Online Reader HTML is the canonical, always-current edition.
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
            transition={{ delay: i * 0.1 }}
            className={`card-pharma group flex flex-col gap-4 no-underline ${res.primary ? "border-primary/50 ring-1 ring-primary/20 sm:col-span-2" : ""}`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg bg-muted ${colorMap[res.type] ?? "text-primary"}`}>
                {iconMap[res.type] ?? <File className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
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
          {" "}· Healthcare GCC &amp; Digital Transformation Handbook — Comprehensive Edition 2025
        </p>
      </div>
    </div>
  );
}
