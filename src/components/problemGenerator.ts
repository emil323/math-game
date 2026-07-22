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
  // Fractions appear less often than whole numbers by default
  const weightedPool: ProblemCategory[] = [];
  for (const cat of categories) {
    if (cat === 'whole') {
      // Whole numbers get 5 slots
      for (let i = 0; i < 5; i++) weightedPool.push('whole');
    } else if (cat === 'fraction') {
      // Fractions get 2 slots
      for (let i = 0; i < 2; i++) weightedPool.push('fraction');
    } else if (cat === 'equation') {
      // Equations get 2 slots
      for (let i = 0; i < 2; i++) weightedPool.push('equation');
    }
  }

  return weightedPool[randomInt(0, weightedPool.length - 1)];
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

/** Generate a proper fraction in simplest form (GCD(numerator, denominator) === 1). */
function generateSimplifiedFraction(denMin: number, denMax: number): [number, number] {
  const den = randomInt(denMin, denMax);
  let num = randomInt(1, den - 1);
  while (gcd(num, den) !== 1) {
    num = randomInt(1, den - 1);
  }
  return [num, den];
}

export function generateFractionProblem(difficulty: Difficulty): MathProblem {
  const operation: Operation = Math.random() < 0.5 ? 'fractionAdd' : 'fractionSub';
  const isAdd = operation === 'fractionAdd';

  let denRangeMin: number;
  let denRangeMax: number;
  let sameDenominator: boolean;
  let requireProperResult: boolean; // result must be <= 1

  switch (difficulty) {
    case 'barneskole':
      denRangeMin = 2;
      denRangeMax = 10;
      sameDenominator = true;
      requireProperResult = true;
      break;
    case 'ungdomskole':
      denRangeMin = 2;
      denRangeMax = 10;
      sameDenominator = Math.random() < 0.5;
      requireProperResult = false;
      break;
    case 'videregående':
      denRangeMin = 2;
      denRangeMax = 24;
      sameDenominator = false;
      requireProperResult = false;
      break;
    default:
      denRangeMin = 2;
      denRangeMax = 4;
      sameDenominator = true;
      requireProperResult = true;
  }

  let num1Num: number;
  let num1Den: number;
  let num2Num: number;
  let num2Den: number;

  if (sameDenominator) {
    // Both fractions share the same denominator, simplified form
    let den = randomInt(denRangeMin, denRangeMax);
    num1Den = den;
    num2Den = den;

    if (isAdd && requireProperResult) {
      // For barneskole addition: num1 + num2 <= den (result is proper or exactly 1)
      // Pick num1 first, then constrain num2
      num1Num = randomInt(1, den - 1);
      while (gcd(num1Num, den) !== 1) {
        num1Num = randomInt(1, den - 1);
      }
      // num2 must be >= 1 and num1Num + num2 <= den
      const maxNum2 = den - num1Num;
      if (maxNum2 < 1) {
        // Retry with a smaller num1
        num1Num = randomInt(1, Math.max(1, Math.floor(den / 2)));
        while (gcd(num1Num, den) !== 1) {
          num1Num = randomInt(1, Math.max(1, Math.floor(den / 2)));
        }
      }
      num2Num = randomInt(1, Math.min(maxNum2, den - 1));
      while (gcd(num2Num, den) !== 1) {
        num2Num = randomInt(1, Math.min(maxNum2, den - 1));
      }
    } else if (!isAdd) {
      // Subtraction: ensure num1 >= num2 for non-negative result
      num1Num = randomInt(1, den - 1);
      while (gcd(num1Num, den) !== 1) {
        num1Num = randomInt(1, den - 1);
      }
      num2Num = randomInt(1, Math.max(1, num1Num));
      while (gcd(num2Num, den) !== 1) {
        num2Num = randomInt(1, Math.max(1, num1Num));
      }
    } else {
      // ungdomskole same-denominator addition (improper results OK)
      [num1Num, num1Den] = generateSimplifiedFraction(denRangeMin, denRangeMax);
      den = num1Den;
      num2Den = den;
      num2Num = randomInt(1, den - 1);
      while (gcd(num2Num, den) !== 1) {
        num2Num = randomInt(1, den - 1);
      }
    }
  } else {
    // Different denominators — restrict to friendly values so LCM stays manageable for mental math
    const friendlyDens = [2, 3, 4, 6, 8, 12];
    num1Den = friendlyDens[randomInt(0, friendlyDens.length - 1)];
    num2Den = friendlyDens[randomInt(0, friendlyDens.length - 1)];
    while (num1Den === num2Den) {
      num2Den = friendlyDens[randomInt(0, friendlyDens.length - 1)];
    }
    num1Num = randomInt(1, num1Den - 1);
    while (gcd(num1Num, num1Den) !== 1) {
      num1Num = randomInt(1, num1Den - 1);
    }
    num2Num = randomInt(1, num2Den - 1);
    while (gcd(num2Num, num2Den) !== 1) {
      num2Num = randomInt(1, num2Den - 1);
    }

    if (!isAdd) {
      // Subtraction: ensure first fraction >= second for non-negative result
      const val1 = num1Num / num1Den;
      const val2 = num2Num / num2Den;
      if (val1 < val2) {
        [num1Num, num2Num] = [num2Num, num1Num];
        [num1Den, num2Den] = [num2Den, num1Den];
      }
    }
  }

  const commonDen = num1Den * num2Den;
  const an =
    isAdd
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

export function generateWholeNumberProblem(difficulty: Difficulty): MathProblem {
  const operations: Operation[] = ['addition', 'subtraction', 'multiplication', 'division'];
  const operation = operations[randomInt(0, 3)];

  let num1: number;
  let num2: number;

  if (operation === 'multiplication' || operation === 'division') {
    switch (difficulty) {
      case 'barneskole':
        num1 = randomInt(1, 5);
        num2 = randomInt(1, 5);
        break;
      case 'ungdomskole':
        num1 = randomInt(2, 12);
        num2 = randomInt(2, 12);
        break;
      case 'videregående':
        num1 = randomInt(5, 20);
        num2 = randomInt(5, 20);
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
      case 'barneskole':
        num1 = randomInt(1, 20);
        num2 = randomInt(1, 20);
        break;
      case 'ungdomskole':
        num1 = randomInt(10, 100);
        num2 = randomInt(10, 100);
        break;
      case 'videregående':
        num1 = randomInt(50, 500);
        num2 = randomInt(50, 500);
        break;
      default:
        num1 = randomInt(1, 20);
        num2 = randomInt(1, 20);
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

export function generateEquationProblem(difficulty: Difficulty): MathProblem {
  // Work backwards: pick x (the answer) first, then build the equation

  let xMin: number;
  let xMax: number;
  let aMin: number;
  let aMax: number;
  let bMin: number;
  let bMax: number;

  switch (difficulty) {
    case 'barneskole':
      xMin = 1;
      xMax = 10;
      aMin = 1;
      aMax = 1;
      bMin = 1;
      bMax = 10;
      break;
    case 'ungdomskole':
      xMin = 1;
      xMax = 15;
      aMin = 2;
      aMax = 5;
      bMin = 1;
      bMax = 20;
      break;
    case 'videregående':
      xMin = 2;
      xMax = 20;
      aMin = 3;
      aMax = 8;
      bMin = 5;
      bMax = 30;
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

  const usePlus = difficulty === 'barneskole' || Math.random() < 0.6;
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
