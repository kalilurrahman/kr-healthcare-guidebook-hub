import { useState, useMemo, useCallback } from "react";
import { Mail, Printer, Copy, Check, ExternalLink } from "lucide-react";

// Set this to BigMo's real intake address to activate the lead funnel.
// While it is empty, the email CTA is hidden rather than silently mailing a
// reserved .example address that can never receive anything.
const LEAD_INTAKE_EMAIL = "";

// mailto: bodies are truncated (or fail to launch a client) past ~2000 chars in
// several OS/mail-client combinations, so long reports are trimmed with a note.
const MAILTO_BODY_LIMIT = 1500;

interface LeadCaptureProps {
  tool: string;
  summary: string;
}

/**
 * Reusable results-page lead funnel: copy a shareable summary, print / save as
 * PDF, email the intake address (via a prefilled mailto — no backend), or book
 * a session. Marked .no-print so it never appears in the printed report.
 */
export function LeadCapture({ tool, summary }: LeadCaptureProps) {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`${tool} — send me the full benchmark pack`);
    const trimmed = summary.length > MAILTO_BODY_LIMIT
      ? `${summary.slice(0, MAILTO_BODY_LIMIT)}\n\n[results truncated — full report attached via Print / Save PDF]`
      : summary;
    const body = encodeURIComponent(
      `Hi BigMo team,\n\nI ran the ${tool} and would like the full benchmarked pack and a short walkthrough.\n\nMy email: ${email || "[add your email]"}\n\n--- My results ---\n${trimmed}\n`
    );
    return `mailto:${LEAD_INTAKE_EMAIL}?subject=${subject}&body=${body}`;
  }, [tool, summary, email]);

  const copySummary = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${tool}\n\n${summary}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [tool, summary]);

  const print = useCallback(() => window.print(), []);

  return (
    <div className="no-print rounded-2xl border border-primary/30 bg-primary/5 p-6">
      <h3 className="font-display text-sm font-bold text-foreground mb-1">Take this further</h3>
      <p className="font-body text-xs text-muted-foreground mb-4">
        Get a peer-benchmarked scorecard and a costed transformation plan built on your live data.
      </p>

      {LEAD_INTAKE_EMAIL && (
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@organization.com"
            aria-label="Your work email"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground font-body focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40"
          />
          <a
            href={mailtoHref}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-mono text-xs font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <Mail className="w-3.5 h-3.5" /> Email me the pack
          </a>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={copySummary} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground font-mono text-[11px] hover:text-primary hover:border-primary/40 transition-colors">
          {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy summary</>}
        </button>
        <button onClick={print} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground font-mono text-[11px] hover:text-primary hover:border-primary/40 transition-colors">
          <Printer className="w-3.5 h-3.5" /> Print / Save PDF
        </button>
        <a
          href="https://www.linkedin.com/in/kalilurrahman/"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-muted-foreground font-mono text-[11px] hover:text-primary hover:border-primary/40 transition-colors"
        >
          Book a session <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
