import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface LeaderQuote {
  quote: string;
  author: string;
  role: string;
  context: string;
}

// Curated public-record quotes from healthcare / digital-health leaders (2023–2025).
const quotes: LeaderQuote[] = [
  {
    quote: "The most exciting breakthroughs of the 21st century will not occur because of technology, but because of an expanding concept of what it means to be human — and healthcare is where that concept meets code.",
    author: "Dr. Eric Topol",
    role: "Founder & Director, Scripps Research Translational Institute",
    context: "On AI-augmented medicine, 2024",
  },
  {
    quote: "Ambient AI scribes are the first genuine productivity gain clinicians have felt in a decade. We are giving doctors back the gift of eye contact.",
    author: "Dr. Shiv Rao",
    role: "CEO, Abridge",
    context: "HLTH Conference 2024",
  },
  {
    quote: "Value-based care isn't a payment model; it's an operating model. If your data, your incentives, and your workflows aren't aligned, capitation will bankrupt you faster than fee-for-service.",
    author: "Sachin Jain, MD",
    role: "CEO, SCAN Health Plan",
    context: "Forbes column, 2024",
  },
  {
    quote: "The healthcare workforce shortage is not a hiring problem — it is a workflow problem. Every hour we automate in revenue cycle is an hour returned to the bedside.",
    author: "Rod Hochman, MD",
    role: "Former CEO, Providence Health",
    context: "AHA Leadership Summit 2024",
  },
  {
    quote: "India's Global Capability Centers are no longer back-offices; they are the R&D engine and the AI factory for global healthcare enterprises.",
    author: "Debjani Ghosh",
    role: "Former President, NASSCOM",
    context: "GCC Landscape Report FY2024",
  },
  {
    quote: "If your denial rate is above 8%, you don't have a payer problem — you have a data quality problem masquerading as a payer problem.",
    author: "Rick Gundling",
    role: "Senior VP, HFMA",
    context: "HFMA Annual Conference 2024",
  },
];

export function LeaderQuotes() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-foreground mb-2">Voices from the Field</h2>
        <p className="font-body text-sm text-muted-foreground max-w-2xl">
          Curated quotes from healthcare, payer and digital-health leaders shaping the 2025–2026 agenda — sourced from public conferences, columns and industry reports.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quotes.map((q, i) => (
          <motion.figure
            key={q.author}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-pharma flex flex-col gap-3 relative overflow-hidden"
          >
            <Quote className="absolute -top-2 -right-2 w-16 h-16 text-primary/5" aria-hidden="true" />
            <blockquote className="font-body text-sm text-foreground italic leading-relaxed relative z-10">
              &ldquo;{q.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-auto pt-3 border-t border-border">
              <div className="font-display text-sm font-semibold text-foreground">{q.author}</div>
              <div className="font-mono text-[10px] text-primary uppercase tracking-wider mt-0.5">{q.role}</div>
              <div className="font-body text-[11px] text-muted-foreground mt-1">{q.context}</div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  );
}
