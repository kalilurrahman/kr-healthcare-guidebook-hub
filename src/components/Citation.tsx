import { ExternalLink, BookOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { resolveCitation } from "@/data/citations";

interface CitationProps {
  /** Short source label as displayed, e.g. "HFMA MAP Keys" or "NSI 2025". */
  source: string;
  /** Optional extra context line, e.g. where a quote was said. */
  context?: string;
  className?: string;
}

/** Inline citation chip: hover or focus reveals the primary source with a direct link. */
export function Citation({ source, context, className = "" }: CitationProps) {
  const cite = resolveCitation(source);

  const trigger = (
    <span
      tabIndex={0}
      role="button"
      aria-label={`Primary source: ${cite ? cite.publisher : source}`}
      className={`inline-flex items-center gap-1 cursor-help underline decoration-dotted decoration-muted-foreground/50 underline-offset-2 hover:text-primary focus:text-primary focus:outline-none transition-colors ${className}`}
    >
      {source}
      <BookOpen className="w-3 h-3 opacity-60" aria-hidden="true" />
    </span>
  );

  if (!cite) return trigger;

  return (
    <Tooltip delayDuration={120}>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent side="top" align="end" className="max-w-xs text-left">
        <div className="font-mono text-[9px] uppercase tracking-wider text-primary">{cite.publisher}</div>
        <div className="font-body text-xs font-semibold mt-0.5">{cite.title}</div>
        {cite.note && <p className="font-body text-[11px] text-muted-foreground mt-1 leading-relaxed">{cite.note}</p>}
        {context && <p className="font-body text-[11px] text-muted-foreground mt-1 italic">{context}</p>}
        <a
          href={cite.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-mono text-[10px] text-teal hover:underline mt-2"
        >
          Open primary source <ExternalLink className="w-3 h-3" />
        </a>
      </TooltipContent>
    </Tooltip>
  );
}
