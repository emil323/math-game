export type Operation = 'addition' | 'subtraction';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface MathProblem {
  num1: number;
  num2: number;
  operation: Operation;
  correctAnswer: number;
  userAnswer: number | null;
  isCorrect: boolean | null;
}

export interface GameStats {
  total: number;
  correct: number;
  incorrect: number;
}
