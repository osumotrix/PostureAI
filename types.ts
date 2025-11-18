export interface PostureAnalysis {
  score: number;
  status: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Unknown';
  issues: string[];
  recommendations: string[];
  summary: string;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  lastRun: Date | null;
  data: PostureAnalysis | null;
  error: string | null;
}

export enum WebcamStatus {
  IDLE = 'IDLE',
  active = 'ACTIVE',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  ERROR = 'ERROR'
}