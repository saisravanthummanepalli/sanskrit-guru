
export enum ResponseType {
  WORD_ANALYSIS = 'WORD_ANALYSIS',
  GRAMMAR_TABLE = 'GRAMMAR_TABLE',
  SENTENCE_TRANSLATION = 'SENTENCE_TRANSLATION',
  CONCEPT_EXPLANATION = 'CONCEPT_EXPLANATION'
}

export interface SanskritTerm {
  devanagari: string;
  iast: string;
  english: string;
}

export interface GrammarTable {
  title: string;
  headers: string[];
  rows: string[][];
}

export interface EtymologyPart {
  component: string;
  meaning: string;
}

export interface AcharyaResponse {
  type: ResponseType;
  mainTerm: SanskritTerm;
  etymology?: string;
  etymologyBreakdown?: EtymologyPart[];
  grammarTable?: GrammarTable;
  analysis?: string;
  examples?: SanskritTerm[];
  teacherNote: string;
}

export interface HistoryItem {
  query: string;
  response: AcharyaResponse;
  timestamp: number;
}
