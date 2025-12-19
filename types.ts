export interface Student {
  id: string;
  name: string;
  score: number;
  status: 'PENDING' | 'PLAYING' | 'COMPLETED';
}

export interface GroupData {
  name: string;
  students: Student[];
}

export interface Challenge {
  buggyCode: string;
  expectedOutput: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface EvaluationResult {
  isCorrect: boolean;
  score: number; // 0 to 15
  feedback: string;
  correctedCodeSnippet?: string;
}

export enum AppState {
  SETUP = 'SETUP',
  GAME = 'GAME',
  SUMMARY = 'SUMMARY'
}

export interface GameState {
  currentStudentId: string | null;
  currentChallenge: Challenge | null;
  isEvaluating: boolean;
  evaluationResult: EvaluationResult | null;
}