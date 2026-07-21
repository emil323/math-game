export type Operation =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'fractionAdd'
  | 'fractionSub'
  | 'equationAdd'
  | 'equationSub'
  | 'equationMul';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type ProblemCategory = 'whole' | 'fraction' | 'equation';

export interface MathProblem {
  num1: number;
  num2: number;
  operation: Operation;
  correctAnswer: number;
  userAnswer: number | null;
  isCorrect: boolean | null;
  isFraction?: boolean;
  num1Num?: number;
  num1Den?: number;
  num2Num?: number;
  num2Den?: number;
  answerNum?: number;
  answerDen?: number;
  userAnswerNum?: number;
  userAnswerDen?: number;
  isEquation?: boolean;
}

export interface GameStats {
  total: number;
  correct: number;
  incorrect: number;
}
