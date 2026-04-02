import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Send } from "lucide-react";
import { toast } from "sonner";

export function OnlineReaderPlaceholder() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    // Placeholder — will be wired to Supabase when Cloud is enabled
    await new Promise((r) => setTimeout(r, 600));
    toast.success("You're on the list! We'll notify you when the reader launches.");
    setEmail("");
    setSubmitting(false);
  };

  return (
    <section id="online-reader" className="py-16 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 sm:p-12 rounded-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-dot" />
            <span className="font-mono text-xs text-primary tracking-wider uppercase">Reader Launching in 2 Days</span>
          </div>

          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Read Online — Full Handbook</h2>

          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>

          <p className="font-body text-muted-foreground leading-relaxed mb-8 max-w-lg mx-auto">
            The full interactive online reader with all 30 strategic chapters and 61 RCM playbook chapters is being finalized. Enter your email below to be notified when it goes live.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="search-input-pharma flex-1"
              aria-label="Email address for notification"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-lg font-mono text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: "hsl(var(--primary))", color: "white" }}
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? "Sending..." : "Notify Me"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
