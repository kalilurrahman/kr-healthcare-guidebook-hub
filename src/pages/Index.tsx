import { useState, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HealthcareHeader } from "@/components/HealthcareHeader";
import { CoverSection } from "@/components/CoverSection";
import { OverviewSection } from "@/components/OverviewSection";
import { ChapterViewer } from "@/components/ChapterViewer";
import { ResourcesSection } from "@/components/ResourcesSection";
import { HealthcareFooter } from "@/components/HealthcareFooter";
import { InstallPrompt } from "@/components/InstallPrompt";
import { allChapters, healthcareVolumes } from "@/data/healthcare-data";

const volumeNavItems = [
  { id: "overview", label: "Overview" },
  { id: "vol-1", label: "Vol 1 · Market" },
  { id: "vol-2", label: "Vol 2 · RCM" },
  { id: "vol-3", label: "Vol 3 · AI & Droidal" },
  { id: "vol-4", label: "Vol 4 · Pulmonary" },
  { id: "vol-5", label: "Vol 5 · Operations" },
  { id: "vol-6", label: "Vol 6 · India GCC" },
  { id: "vol-7", label: "Vol 7 · Growth" },
  { id: "vol-8", label: "Vol 8 · 2030" },
  { id: "resources", label: "📥 Resources" },
];

const volumeIndexMap: Record<string, number> = {
  "vol-1": 0,
  "vol-2": 1,
  "vol-3": 2,
  "vol-4": 3,
  "vol-5": 4,
  "vol-6": 5,
  "vol-7": 6,
  "vol-8": 7,
};

const Index = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const handleSectionChange = useCallback((id: string) => {
    setActiveSection(id);
    setSearchQuery("");
    setSelectedChapter(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChapterSelect = useCallback((chapterId: string) => {
    setSelectedChapter(chapterId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const filteredChapters = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      return allChapters.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.teaser.toLowerCase().includes(q) ||
          c.tag.toLowerCase().includes(q) ||
          c.volumeLabel.toLowerCase().includes(q)
      );
    }
    const volIndex = volumeIndexMap[activeSection];
    if (volIndex !== undefined) {
      return healthcareVolumes[volIndex].chapters;
    }
    return null;
  }, [searchQuery, activeSection]);

  const isSearching = searchQuery.trim().length > 0;
  const showOverview = !isSearching && activeSection === "overview" && !selectedChapter;
  const showResources = !isSearching && activeSection === "resources" && !selectedChapter;
  const showFilteredGrid = filteredChapters !== null && !selectedChapter;

  const currentChapter = selectedChapter ? allChapters.find((c) => c.id === selectedChapter) : undefined;
  const currentChapterIndex = selectedChapter ? allChapters.findIndex((c) => c.id === selectedChapter) : -1;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HealthcareHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeSection={isSearching ? "" : activeSection}
        onSectionChange={handleSectionChange}
        navItems={volumeNavItems}
      />

      {showOverview && !selectedChapter && <CoverSection />}

      <main className="container mx-auto py-8 px-4 flex-1">
        <AnimatePresence mode="wait">
          {selectedChapter && currentChapter ? (
            <ChapterViewer
              key={selectedChapter}
              chapter={currentChapter}
              onBack={() => setSelectedChapter(null)}
              onPrev={currentChapterIndex > 0 ? () => handleChapterSelect(allChapters[currentChapterIndex - 1].id) : undefined}
              onNext={currentChapterIndex < allChapters.length - 1 ? () => handleChapterSelect(allChapters[currentChapterIndex + 1].id) : undefined}
              hasPrev={currentChapterIndex > 0}
              hasNext={currentChapterIndex < allChapters.length - 1}
            />
          ) : showResources ? (
            <motion.div key="resources" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ResourcesSection />
            </motion.div>
          ) : showOverview ? (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <OverviewSection onChapterSelect={handleChapterSelect} />
            </motion.div>
          ) : showFilteredGrid ? (
            <motion.div key={`filtered-${activeSection}-${searchQuery}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {filteredChapters && filteredChapters.length > 0 ? (
                <div>
                  {isSearching && (
                    <p className="text-sm text-muted-foreground mb-6 font-mono">
                      {filteredChapters.length} result{filteredChapters.length !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredChapters.map((ch, i) => (
                      <div key={ch.id}>
                        <div
                          onClick={() => handleChapterSelect(ch.id)}
                          className="card-pharma border-t-[3px] border-t-primary cursor-pointer"
                        >
                          <span className="font-mono text-xs text-primary tracking-wider">Chapter {ch.num}</span>
                          <h3 className="font-display text-lg font-semibold text-foreground mb-2 mt-1">{ch.title}</h3>
                          <p className="font-body text-sm text-muted-foreground">{ch.teaser}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-xl text-muted-foreground font-body">No results found for &quot;{searchQuery}&quot;</p>
                  <p className="text-sm text-muted-foreground mt-2 font-body">Try different keywords or browse sections above.</p>
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      <HealthcareFooter />
      <InstallPrompt />
    </div>
  );
};

export default Index;
