import { motion } from "framer-motion";
import { strategicChapters } from "@/data/strategic-chapters";
import { toast } from "sonner";

export function StrategicChaptersGrid() {
  const handleReadClick = () => {
    toast.info("Full reader launching in 2 days — enter your email above to be notified.");
  };

  return (
    <section id="strategic-chapters" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="font-mono text-xs text-primary font-bold">30 Chapters</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">Strategic Chapters</h2>
          <p className="font-body text-muted-foreground max-w-2xl">
            Source: Healthcare Industry Deep Dive — 30 chapters spanning every healthcare domain from macro-economics to specialty care.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategicChapters.map((ch, i) => (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="card-pharma border-t-[3px] border-t-primary"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 font-mono text-xs text-primary font-bold">
                  {ch.id}
                </span>
                <span className="tag-pill text-[10px]">{ch.tag}</span>
              </div>
              <h3 className="font-display text-base font-semibold text-foreground mb-2 leading-tight">{ch.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{ch.teaser}</p>
              <button
                onClick={handleReadClick}
                className="font-mono text-xs text-primary hover:text-teal-light transition-colors flex items-center gap-1"
              >
                Read Chapter →
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
