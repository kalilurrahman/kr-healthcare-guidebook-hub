import { motion } from "framer-motion";

export function AboutHandbook() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-3xl font-bold text-foreground mb-6">Why This Handbook Exists</h2>

          <div className="font-body text-base text-muted-foreground leading-relaxed space-y-4 mb-10">
            <p>
              The healthcare industry is navigating a period of profound structural transformation. US healthcare EBITDA as a percentage of National Health Expenditures fell from 11.2% in 2019 to 8.9% in 2024 — and is projected to decline further to 8.7% by 2027. Denial pressure, chronic disease burden, workforce shortages, and digital expectations are not separate problems. They require an enterprise model that connects revenue cycle, care management, pharmacy operations, analytics, and GCC design into one integrated transformation framework.
            </p>
            <p>This handbook is that framework. It is built for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Healthcare CFOs and COOs managing margin compression</li>
              <li>Revenue Cycle Directors managing denial rates and clean claim targets</li>
              <li>GCC Leaders designing capability centers for provider and payer organizations</li>
              <li>IT and AI Leaders deploying automation across RCM and clinical operations</li>
              <li>Consultants and advisors building transformation roadmaps</li>
            </ul>
            <p className="font-semibold text-foreground">Five leadership priorities anchor every chapter:</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Strengthen front-end access, data capture, and authorization</li>
              <li>Build integrated coding, charge capture, and revenue integrity controls</li>
              <li>Invest in analytics, AI, and automation tied to operational use cases</li>
              <li>Organize healthcare GCCs as true capability hubs</li>
              <li>Create strong compliance, provider-data, and governance layers</li>
            </ol>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { value: "30 Strategic Chapters", desc: "Covering the full healthcare value chain" },
              { value: "61 RCM & GCC Deep Dives", desc: "Operational playbooks for every domain" },
              { value: "India-First GCC Context", desc: "Hyderabad · Bengaluru · Chennai · Pune" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-pharma border-l-4 border-l-violet"
              >
                <div className="font-display text-lg font-bold text-foreground mb-1">{s.value}</div>
                <div className="font-body text-sm text-muted-foreground">{s.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
