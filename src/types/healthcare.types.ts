export interface ChapterMetric {
  value: string;
  label: string;
}

export interface ChapterStat {
  l: string;
  v: string;
}

export interface HealthcareChapter {
  id: string;
  num: string;
  volumeLabel: string;
  title: string;
  teaser: string;
  tag: string;
  stats: ChapterStat[];
  content: string;
  actions: string[];
}

export interface HealthcareVolume {
  group: string;
  chapters: HealthcareChapter[];
}

export interface ResourceFile {
  name: string;
  filename: string;
  type: "pdf" | "docx" | "xlsx" | "pptx" | "html" | "zip";
  size: string;
  description: string;
  primary?: boolean;
}

export interface HandbookStats {
  chapters: number;
  volumes: number;
  playbooks: number;
  words: string;
}
