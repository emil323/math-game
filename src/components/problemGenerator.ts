// Pure problem generation logic — no React dependencies
import type { Difficulty, MathProblem, Operation, ProblemCategory } from '../types';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function gcd(aParam: number, bParam: number): number {
  let a = Math.abs(aParam);
  let b = Math.abs(bParam);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

/** Pick a random category based on what's enabled, respecting frequency weights. */
function pickCategory(categories: ProblemCategory[]): ProblemCategory {
  const activeCategories = [
    categories.includes('whole') ? 'whole' : null,
    categories.includes('fraction') ? 'fraction' : null,
    categories.includes('equation') ? 'equation' : null
  ].filter((c): c is ProblemCategory => c !== null);

  return activeCategories[randomInt(0, activeCategories.length - 1)];
}

/** Generate a problem of the given category and difficulty. */
export function generateProblem(
  difficulty: Difficulty,
  categories: ProblemCategory[]
): MathProblem {
  const chosen = pickCategory(categories);

  if (chosen === 'fraction') return generateFractionProblem(difficulty);
  if (chosen === 'equation') return generateEquationProblem(difficulty);
  return generateWholeNumberProblem(difficulty);
}

// ---------------------------------------------------------------------------
// Fraction problems
// ---------------------------------------------------------------------------

function generateFractionProblem(difficulty: Difficulty): MathProblem {
  const operation: Operation = Math.random() < 0.5 ? 'fractionAdd' : 'fractionSub';

  let denRangeMin: number;
  let denRangeMax: number;
  let sameDenominator: boolean;

  switch (difficulty) {
    case 'easy':
      denRangeMin = 2;
      denRangeMax = 4;
      sameDenominator = true;
      break;
    case 'medium':
      denRangeMin = 2;
      denRangeMax = 6;
      sameDenominator = Math.random() < 0.5;
      break;
    case 'hard':
      denRangeMin = 2;
      denRangeMax = 12;
      sameDenominator = false;
      break;
    default:
      denRangeMin = 2;
      denRangeMax = 4;
      sameDenominator = true;
  }

  let num1Den = randomInt(denRangeMin, denRangeMax);
  let num1Num = randomInt(1, num1Den);
  let num2Den = sameDenominator ? num1Den : randomInt(denRangeMin, denRangeMax);
  let num2Num = randomInt(1, num2Den);

  if (operation === 'fractionSub') {
    const val1 = num1Num / num1Den;
    const val2 = num2Num / num2Den;
    if (val1 < val2) {
      [num1Num, num2Num] = [num2Num, num1Num];
      [num1Den, num2Den] = [num2Den, num1Den];
    }
  }

  const commonDen = num1Den * num2Den;
  const an =
    operation === 'fractionAdd'
      ? num1Num * num2Den + num2Num * num1Den
      : num1Num * num2Den - num2Num * num1Den;

  const g = gcd(an, commonDen);
  const answerNum = an / g;
  const answerDen = commonDen / g;

  return {
    num1: 0,
    num2: 0,
    operation,
    correctAnswer: 0,
    userAnswer: null,
    isCorrect: null,
    isFraction: true,
    num1Num,
    num1Den,
    num2Num,
    num2Den,
    answerNum,
    answerDen
  };
}

// ---------------------------------------------------------------------------
// Whole number problems
// ---------------------------------------------------------------------------

function generateWholeNumberProblem(difficulty: Difficulty): MathProblem {
  const operations: Operation[] = ['addition', 'subtraction', 'multiplication', 'division'];
  const operation = operations[randomInt(0, 3)];

  let num1: number;
  let num2: number;

  if (operation === 'multiplication' || operation === 'division') {
    switch (difficulty) {
      case 'easy':
        num1 = randomInt(1, 5);
        num2 = randomInt(1, 5);
        break;
      case 'medium':
        num1 = randomInt(2, 12);
        num2 = randomInt(2, 12);
        break;
      case 'hard':
        num1 = randomInt(5, 20);
        num2 = randomInt(2, 15);
        break;
      default:
        num1 = randomInt(1, 5);
        num2 = randomInt(1, 5);
    }

    if (operation === 'division') {
      const answer = num1;
      num1 = num2 * answer;
    }
  } else {
    switch (difficulty) {
      case 'easy':
        num1 = randomInt(1, 10);
        num2 = randomInt(1, 10);
        break;
      case 'medium':
        num1 = randomInt(10, 50);
        num2 = randomInt(10, 50);
        break;
      case 'hard':
        num1 = randomInt(50, 100);
        num2 = randomInt(50, 100);
        break;
      default:
        num1 = randomInt(1, 10);
        num2 = randomInt(1, 10);
    }

    if (operation === 'subtraction' && num1 < num2) {
      [num1, num2] = [num2, num1];
    }
  }

  let correctAnswer: number;
  switch (operation) {
    case 'addition':
      correctAnswer = num1 + num2;
      break;
    case 'subtraction':
      correctAnswer = num1 - num2;
      break;
    case 'multiplication':
      correctAnswer = num1 * num2;
      break;
    case 'division':
      correctAnswer = num1 / num2;
      break;
    default:
      correctAnswer = 0;
  }

  return {
    num1,
    num2,
    operation,
    correctAnswer,
    userAnswer: null,
    isCorrect: null,
    isFraction: false,
    isEquation: false
  };
}

// ---------------------------------------------------------------------------
// Equation problems (ax ± b = c)
// ---------------------------------------------------------------------------

function generateEquationProblem(difficulty: Difficulty): MathProblem {
  // Work backwards: pick x (the answer) first, then build the equation

  let xMin: number;
  let xMax: number;
  let aMin: number;
  let aMax: number;
  let bMin: number;
  let bMax: number;

  switch (difficulty) {
    case 'easy':
      xMin = 1;
      xMax = 10;
      aMin = 1;
      aMax = 1;
      bMin = 1;
      bMax = 10;
      break;
    case 'medium':
      xMin = 1;
      xMax = 12;
      aMin = 2;
      aMax = 4;
      bMin = 1;
      bMax = 12;
      break;
    case 'hard':
      xMin = 2;
      xMax = 15;
      aMin = 3;
      aMax = 6;
      bMin = 1;
      bMax = 15;
      break;
    default:
      xMin = 1;
      xMax = 10;
      aMin = 1;
      aMax = 1;
      bMin = 1;
      bMax = 10;
  }

  const x = randomInt(xMin, xMax);
  const a = randomInt(aMin, aMax);
  const b = randomInt(bMin, bMax);

  const usePlus = difficulty === 'easy' || Math.random() < 0.6;
  const op = usePlus ? '+' : '-';

  const c = op === '+' ? a * x + b : a * x - b;

  return {
    num1: 0,
    num2: 0,
    operation: 'equation',
    correctAnswer: x,
    userAnswer: null,
    isCorrect: null,
    isFraction: false,
    isEquation: true,
    eqCoeff: a,
    eqConstant: b,
    eqResult: c,
    eqOp: op
  };
}
