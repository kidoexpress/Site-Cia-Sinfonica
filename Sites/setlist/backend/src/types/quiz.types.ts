// ─── Quiz Types ───────────────────────────────────────────────────────────────

export type QuestionType =
  | "single_choice"
  | "multi_choice"
  | "scale"
  | "date"
  | "text"
  | "textarea"
  | "text_with_search"
  | "artist_search"
  | "track_search"
  | "matrix";

export interface QuestionOption {
  value: string;
  label: string;
  icon?: string;
  tags?: string[];
  weight?: Record<string, number>;
}

export interface MatrixConfig {
  rows: string[];
  columns: Array<{ value: string; label: string }>;
}

export interface ScaleConfig {
  min: number;
  max: number;
  labels: Record<number, string>;
}

export interface TriggerCondition {
  field: string;
  includes?: string[];
  excludes?: string[];
  minValue?: number;
}

export interface Question {
  id: string;
  block: number;
  question: string;
  type: QuestionType;
  options?: QuestionOption[];
  matrix?: MatrixConfig;
  scale?: ScaleConfig;
  maxSelections?: number;
  required?: boolean;
  trigger?: TriggerCondition;
  spotifySearch?: boolean;
  youtubeSearch?: boolean;
  placeholder?: string;
  maxLength?: number;
  validation?: string;
}

// ─── Respostas ────────────────────────────────────────────────────────────────

export type AnswerValue =
  | string
  | string[]
  | number
  | Record<string, string>   // matrix: { row: column }
  | SpotifyArtistRef[]
  | SpotifyTrackRef[];

export interface QuizAnswers {
  [questionId: string]: AnswerValue;
}

export interface SpotifyArtistRef {
  artistName: string;
  spotifyId: string;
  genres: string[];
  popularity: number;
}

export interface SpotifyTrackRef {
  trackName: string;
  artistName: string;
  spotifyId: string;
  youtubeId?: string;
}

// ─── Estado da sessão ─────────────────────────────────────────────────────────

export interface QuizState {
  sessionId: string;
  currentQuestion: Question | null;
  answeredCount: number;
  totalEstimated: number;
  progressPercent: number;
  isComplete: boolean;
  blockLabel: string;
}

export interface QuizProgress {
  sessionId: string;
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  answeredCount: number;
  currentBlock: number;
  currentBlockLabel: string;
  progressPercent: number;
  answers: QuizAnswers;
}
