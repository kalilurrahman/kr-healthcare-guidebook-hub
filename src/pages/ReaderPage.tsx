import { useState, useEffect, useRef, useCallback } from "react";
import { HealthcareFooter } from "@/components/HealthcareFooter";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

/* ──────────── types ──────────── */
interface Section {
  id: string;
  title: string;
  content: string;
}

interface KpiTable {
  headers: string[];
  rows: string[][];
}

interface Chapter {
  id: string;
  number: number;
  title: string;
  executiveSummary: string;
  sections: Section[];
  boardQuestions?: string[];
  kpiTables?: KpiTable[];
  diagrams?: string[];
  regionalSpotlight?: string;
  gccOpportunity?: string;
}

interface Part {
  id: string;
  number: number;
  title: string;
  chapters: Chapter[];
}

interface Handbook {
  title: string;
  edition: string;
  author: string;
  subtitle: string;
  audience: string[];
  parts: Part[];
}

/* ──────────── component ──────────── */
const ReaderPage = () => {
  const [handbook, setHandbook] = useState<Handbook | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChapter, setActiveChapter] = useState<string>("ch-01");
  const [expandedParts, setExpandedParts] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  /* fetch JSON lazily */
  useEffect(() => {
    fetch("/data/healthcare_handbook_2026.json")
      .then((r) => r.json())
      .then((data: Handbook) => {
        setHandbook(data);
        // expand the first part by default
        const init: Record<string, boolean> = {};
        data.parts.forEach((p) => (init[p.id] = p.number === 1));
        setExpandedParts(init);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* helpers */
  const allChapters: Chapter[] = handbook?.parts.flatMap((p) => p.chapters) ?? [];
  const totalChapters = allChapters.length;
  const currentIndex = allChapters.findIndex((c) => c.id === activeChapter);
  const current = allChapters[currentIndex] ?? null;
  const currentPartNum =
    handbook?.parts.find((p) => p.chapters.some((c) => c.id === activeChapter))?.number ?? 1;

  const goTo = useCallback(
    (chId: string) => {
      setActiveChapter(chId);
      setSidebarOpen(false);
      // expand the part that owns this chapter
      if (handbook) {
        const ownerPart = handbook.parts.find((p) => p.chapters.some((c) => c.id === chId));
        if (ownerPart) {
          setExpandedParts((prev) => ({ ...prev, [ownerPart.id]: true }));
        }
      }
      contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [handbook],
  );

  const togglePart = (pid: string) =>
    setExpandedParts((prev) => ({ ...prev, [pid]: !prev[pid] }));

  /* ──────────── loading state ──────────── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#e8f3f7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#0B4F6C] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[#5B8FA8] font-medium">Loading Handbook…</span>
        </div>
      </div>
    );
  }

  if (!handbook || !current) return null;

  /* progress */
  const progress = ((currentIndex + 1) / totalChapters) * 100;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#e8f3f7" }}>
      {/* ─── TOP BAR ─── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between h-14 px-4 border-b shadow-sm"
        style={{ background: "#072d3d", borderColor: "#E8A020" }}
      >
        {/* left */}
        <a
          href="/"
          className="flex items-center gap-2 text-xs font-mono"
          style={{ color: "rgba(255,255,255,.6)" }}
        >
          ← Back to Handbook
        </a>

        {/* centre */}
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5" style={{ color: "#E8A020" }} />
          <span
            className="text-sm font-bold hidden sm:inline"
            style={{ color: "#fff", fontFamily: "'Segoe UI','Helvetica Neue',Arial,sans-serif" }}
          >
            Healthcare DX Handbook 2026
          </span>
          <span className="text-sm font-bold sm:hidden" style={{ color: "#fff" }}>
            Reader
          </span>
        </div>

        {/* right – chapter badge + hamburger */}
        <div className="flex items-center gap-3">
          <span
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: "rgba(232,160,32,.15)", color: "#f5c850", border: "1px solid rgba(232,160,32,.35)" }}
          >
            Chapter {current.number} of {totalChapters}
          </span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 rounded"
            style={{ color: "rgba(255,255,255,.7)" }}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ─── PROGRESS BAR ─── */}
      <div className="h-[3px] w-full" style={{ background: "rgba(11,79,108,.15)" }}>
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${progress}%`, background: "#E8A020" }}
        />
      </div>

      {/* ─── BODY ─── */}
      <div className="flex flex-1 relative">
        {/* ─── SIDEBAR ─── */}
        <aside
          className={`
            fixed lg:sticky top-[calc(3.5rem+3px)] z-40 h-[calc(100vh-3.5rem-3px)]
            overflow-y-auto transition-transform duration-200
            w-[286px] flex-shrink-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
          style={{
            background: "#072d3d",
            boxShadow: "3px 0 24px rgba(0,0,0,.28)",
          }}
        >
          {/* brand */}
          <div
            className="flex items-center gap-3 px-4 py-4"
            style={{ borderBottom: "2px solid #E8A020" }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0"
              style={{ background: "#E8A020", color: "#072d3d" }}
            >
              HC
            </div>
            <div
              className="text-[11px] font-bold uppercase tracking-wide leading-tight"
              style={{ color: "#fff" }}
            >
              Healthcare DX
              <br />
              Handbook 2026
            </div>
          </div>

          {/* nav */}
          <nav className="py-2">
            {handbook.parts.map((part) => (
              <div key={part.id}>
                {/* part header */}
                <button
                  onClick={() => togglePart(part.id)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-left"
                  style={{
                    color: "#E8A020",
                    fontSize: "9px",
                    fontWeight: 800,
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                  }}
                >
                  {expandedParts[part.id] ? (
                    <ChevronDown className="w-3 h-3 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                  )}
                  PART {part.number} — {part.title}
                </button>

                {/* chapter list */}
                {expandedParts[part.id] &&
                  part.chapters.map((ch) => {
                    const isActive = ch.id === activeChapter;
                    return (
                      <button
                        key={ch.id}
                        onClick={() => goTo(ch.id)}
                        className="w-full flex items-start gap-2 px-4 py-[7px] text-left text-xs transition-all"
                        style={{
                          color: isActive ? "#7fe4f7" : "rgba(255,255,255,.72)",
                          background: isActive ? "rgba(255,255,255,.06)" : "transparent",
                          borderLeft: isActive ? "3px solid #E8A020" : "3px solid transparent",
                          lineHeight: 1.35,
                        }}
                      >
                        <span
                          className="min-w-[26px] font-bold pt-px"
                          style={{ color: "#E8A020", fontSize: "10.5px" }}
                        >
                          {ch.number}
                        </span>
                        <span>{ch.title}</span>
                      </button>
                    );
                  })}
              </div>
            ))}
          </nav>
        </aside>

        {/* sidebar overlay on mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ─── READING PANE ─── */}
        <main
          ref={contentRef}
          className="flex-1 min-w-0"
          style={{ fontFamily: "'Segoe UI','Helvetica Neue',Arial,sans-serif" }}
        >
          {/* chapter title banner */}
          <div
            className="px-5 sm:px-16 py-8"
            style={{
              background: "linear-gradient(135deg,#0B4F6C 0%,#1a6b8a 100%)",
              borderBottom: "4px solid #E8A020",
            }}
          >
            <div className="max-w-[980px] mx-auto">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#E8A020" }}>
                Part {currentPartNum} · Chapter {current.number} of {totalChapters}
              </span>
              <h1
                className="text-2xl sm:text-[34px] font-extrabold leading-tight mt-2"
                style={{ color: "#fff" }}
              >
                {current.title}
              </h1>
            </div>
          </div>

          {/* content area */}
          <div className="max-w-[980px] mx-auto px-5 sm:px-16 py-10 sm:py-14">
            {/* Executive Summary */}
            {current.executiveSummary && (
              <div
                className="rounded-lg p-5 sm:p-6 mb-10"
                style={{
                  background: "linear-gradient(135deg,#eef8fc,#d8ecf4)",
                  borderLeft: "5px solid #17A8C8",
                }}
              >
                <span
                  className="block text-[10.5px] font-extrabold uppercase tracking-wide mb-3"
                  style={{ color: "#0B4F6C", letterSpacing: ".1em" }}
                >
                  Executive Summary
                </span>
                <p
                  className="text-[15.5px] leading-relaxed italic"
                  style={{ color: "#1a2b35", lineHeight: 1.75 }}
                >
                  {current.executiveSummary}
                </p>
              </div>
            )}

            {/* Sections */}
            {current.sections.map((sec) => (
              <div key={sec.id} className="mb-10">
                <h2
                  className="text-[21px] font-bold pb-2 mb-4"
                  style={{
                    color: "#0B4F6C",
                    borderBottom: "2px solid #E8A020",
                  }}
                >
                  {sec.title}
                </h2>
                {sec.content.split("\n\n").map((para, i) => {
                  if (para.startsWith("• ")) {
                    return (
                      <li
                        key={i}
                        className="ml-6 text-[15px] leading-relaxed mb-1.5 list-disc"
                        style={{ color: "#1A2B35", lineHeight: 1.72 }}
                      >
                        {para.replace("• ", "")}
                      </li>
                    );
                  }
                  return (
                    <p
                      key={i}
                      className="text-[15.5px] mb-4 text-justify"
                      style={{ color: "#1A2B35", lineHeight: 1.8 }}
                      dangerouslySetInnerHTML={{
                        __html: para.replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong style="color:#0B4F6C;font-weight:700">$1</strong>',
                        ),
                      }}
                    />
                  );
                })}
              </div>
            ))}

            {/* KPI Tables */}
            {current.kpiTables?.map((table, ti) => (
              <div
                key={ti}
                className="overflow-x-auto mb-10 rounded-lg"
                style={{ boxShadow: "0 2px 16px rgba(0,0,0,.1)" }}
              >
                <table className="w-full text-[13.5px]" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {table.headers.map((h, hi) => (
                        <th
                          key={hi}
                          className="text-left text-xs font-bold uppercase tracking-wide px-3.5 py-2.5"
                          style={{
                            background: "#0B4F6C",
                            color: "#fff",
                            letterSpacing: ".04em",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, ri) => (
                      <tr key={ri} className="hover:bg-[#daf0f7]">
                        {row.map((cell, ci) => (
                          <td
                            key={ci}
                            className="px-3.5 py-2.5"
                            style={{
                              borderBottom: "1px solid #c4dae6",
                              background: ri % 2 === 1 ? "#f2f8fb" : "transparent",
                              color: "#1A2B35",
                              lineHeight: 1.5,
                            }}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}

            {/* Diagrams */}
            {current.diagrams && current.diagrams.length > 0 && (
              <div className="space-y-6 mb-10">
                {current.diagrams.map((d, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-6 border"
                    style={{
                      background: "#fff",
                      borderColor: "#b8d8e4",
                      boxShadow: "0 2px 16px rgba(0,0,0,.1)",
                    }}
                  >
                    <div
                      className="h-32 rounded flex items-center justify-center mb-3 text-sm"
                      style={{ background: "#f0f6f9", color: "#5B8FA8" }}
                    >
                      📊 Diagram Placeholder
                    </div>
                    <p
                      className="text-xs text-center italic"
                      style={{ color: "#5B8FA8" }}
                    >
                      {d}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* GCC Opportunity */}
            {current.gccOpportunity && (
              <div
                className="rounded-lg p-5 mb-10"
                style={{
                  background: "#EFF7FA",
                  borderLeft: "5px solid #0B4F6C",
                }}
              >
                <span
                  className="block text-[10.5px] font-extrabold uppercase tracking-wide mb-3"
                  style={{ color: "#0B4F6C" }}
                >
                  🌐 GCC Opportunity
                </span>
                <p className="text-[15px] leading-relaxed" style={{ color: "#1A2B35" }}>
                  {current.gccOpportunity}
                </p>
              </div>
            )}

            {/* Regional Spotlight */}
            {current.regionalSpotlight && (
              <div
                className="rounded-lg p-5 mb-10"
                style={{
                  background: "#EFF7FA",
                  borderLeft: "5px solid #0B4F6C",
                }}
              >
                <span
                  className="block text-[10.5px] font-extrabold uppercase tracking-wide mb-3"
                  style={{ color: "#0B4F6C" }}
                >
                  🌍 Regional Spotlight
                </span>
                <p
                  className="text-[15px] leading-relaxed"
                  style={{ color: "#1A2B35", lineHeight: 1.75 }}
                >
                  {current.regionalSpotlight}
                </p>
              </div>
            )}

            {/* Board Questions */}
            {current.boardQuestions && current.boardQuestions.length > 0 && (
              <div
                className="rounded-lg p-5 mb-10"
                style={{
                  background: "#eef8f2",
                  borderLeft: "5px solid #1D8A5E",
                }}
              >
                <span
                  className="block text-[10.5px] font-extrabold uppercase tracking-wide mb-3"
                  style={{ color: "#1D8A5E" }}
                >
                  ❓ Questions for the Board
                </span>
                <ul className="space-y-2">
                  {current.boardQuestions.map((q, i) => (
                    <li
                      key={i}
                      className="text-[15px] leading-relaxed list-disc ml-5"
                      style={{ color: "#1A2B35" }}
                    >
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prev / Next navigation */}
            <div
              className="flex justify-between items-center pt-10 mt-10"
              style={{ borderTop: "2px solid #c4dae6" }}
            >
              {currentIndex > 0 ? (
                <button
                  onClick={() => goTo(allChapters[currentIndex - 1].id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors"
                  style={{
                    borderColor: "#b8d8e4",
                    color: "#0B4F6C",
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    Ch {allChapters[currentIndex - 1].number}:{" "}
                    {allChapters[currentIndex - 1].title.slice(0, 30)}…
                  </span>
                  <span className="sm:hidden">Previous</span>
                </button>
              ) : (
                <div />
              )}
              {currentIndex < totalChapters - 1 ? (
                <button
                  onClick={() => goTo(allChapters[currentIndex + 1].id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors"
                  style={{
                    borderColor: "#b8d8e4",
                    color: "#0B4F6C",
                  }}
                >
                  <span className="hidden sm:inline">
                    Ch {allChapters[currentIndex + 1].number}:{" "}
                    {allChapters[currentIndex + 1].title.slice(0, 30)}…
                  </span>
                  <span className="sm:hidden">Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>

          <HealthcareFooter />
        </main>
      </div>

      {/* scroll-to-top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          style={{ background: "#0B4F6C", color: "#fff" }}
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ReaderPage;
