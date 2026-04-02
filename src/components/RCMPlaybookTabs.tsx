import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { rcmTabs } from "@/data/rcm-playbook-chapters";
import { toast } from "sonner";

export function RCMPlaybookTabs() {
  const [activeTab, setActiveTab] = useState(rcmTabs[0].id);
  const currentTab = rcmTabs.find((t) => t.id === activeTab) ?? rcmTabs[0];

  const handleReadClick = () => {
    toast.info("Full reader launching in 2 days — enter your email above to be notified.");
  };

  return (
    <section id="rcm-playbook" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet/10 border border-violet/20 mb-4">
            <span className="font-mono text-xs text-violet font-bold">61 Deep Dives</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">RCM &amp; GCC Operational Playbook</h2>
          <p className="font-body text-muted-foreground max-w-2xl">
            61 deep-dive chapters covering every revenue cycle and GCC operating domain — from claims adjudication to AI denial prevention, provider credentialing to population health management.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
          {rcmTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-pill text-xs whitespace-nowrap ${activeTab === tab.id ? "active" : ""}`}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              {tab.label}
              <span className="ml-1.5 text-[10px] opacity-70">({tab.chapters.length})</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {currentTab.chapters.map((ch, i) => (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="card-pharma border-t-[3px] border-t-violet"
              >
                <span className="font-mono text-[10px] text-violet tracking-wider uppercase">{ch.id.toUpperCase()}</span>
                <h3 className="font-display text-sm font-semibold text-foreground mt-1 mb-3 leading-tight">{ch.title}</h3>
                <button
                  onClick={handleReadClick}
                  className="font-mono text-xs text-primary hover:text-teal-light transition-colors flex items-center gap-1"
                >
                  Read Chapter →
                </button>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
