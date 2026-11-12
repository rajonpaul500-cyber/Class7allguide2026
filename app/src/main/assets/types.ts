
export interface Chapter {
  id: string;
  title: string;
  pdfUrl: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  chapters: Chapter[];
  altChapters?: Chapter[];
}

export interface SavedNote {
  id: string;
  text: string;
  date: string;
  category?: string;
}

export type ViewState = 'splash' | 'subjects' | 'chapters' | 'content' | 'tools' | 'model_test';
export type GuideMode = 'guide' | 'altGuide';
export type ToolSubView = 'calculator' | 'note' | 'converter' | 'timer' | 'formulas' | 'grammar';
export type ThemeMode = 'sky' | 'light' | 'dark';

export interface MCQQuestion {
  id: number;
  question: string;
  options: [string, string, string, string];
  answerIndex: number;
  explanation?: string;
  chapter?: string;
}

export interface ModelTestResult {
  id: string;
  subjectId: string;
  subjectName: string;
  setName: string;
  score: number;
  total: number;
  date: string;
  timeSpentSeconds: number;
}

declare module '*.gif' {
  const content: string;
  export default content;
}
declare module '*.png' {
  const content: string;
  export default content;
}
declare module '*.jpg' {
  const content: string;
  export default content;
}
declare module '*.svg' {
  const content: string;
  export default content;
}

