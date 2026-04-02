import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export function AboutKR() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-3xl font-bold text-foreground mb-6">About the Author</h2>

          <div className="flex items-start gap-6 mb-6">
            <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center font-display text-2xl font-bold text-primary-foreground flex-shrink-0">
              KR
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">Kalilur Rahman</h3>
              <p className="font-mono text-xs text-primary mt-1">Global IT Executive · AI Thought Leader · Kaggle Legacy Grandmaster</p>
            </div>
          </div>

          <div className="font-body text-base text-muted-foreground leading-relaxed space-y-4 mb-8">
            <p>
              Kalilur Rahman is a Global IT Executive and AI Thought Leader with nearly 30 years of enterprise IT leadership experience across quality engineering, GCC scaling, healthcare digital transformation, and enterprise AI governance.
            </p>
            <p>
              He is a Kaggle Legacy Grandmaster, Thinkers360 top-ranked global thought leader, published author (Python, Selenium, Software Testing), and creator of two proprietary frameworks:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-foreground">ACUITAS™</strong> — AI Quality Engineering Framework (7 Pillars)</li>
              <li><strong className="text-foreground">CLARITY™</strong> — AI Product Management Framework (7 Disciplines)</li>
            </ul>
            <p>
              He has served healthcare and technology organizations across India and globally, advising on GCC strategy, revenue cycle transformation, and AI-powered operating models. This handbook distils decades of frontline experience into a practitioner reference for the next era of healthcare operations.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a href="https://www.linkedin.com/in/kalilurrahman/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-teal-light transition-colors flex items-center gap-1.5 font-mono">
              LinkedIn <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://github.com/kalilurrahman" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-teal-light transition-colors flex items-center gap-1.5 font-mono">
              GitHub <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://kalilurrahman.lovable.app" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-teal-light transition-colors flex items-center gap-1.5 font-mono">
              Portfolio <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
