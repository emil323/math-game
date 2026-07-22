import { describe, expect, it } from 'vitest';
import {
  gcd,
  generateEquationProblem,
  generateFractionProblem,
  generateProblem,
  generateWholeNumberProblem
} from './problemGenerator';

describe('gcd', () => {
  it('returns the greatest common divisor', () => {
    expect(gcd(12, 8)).toBe(4);
    expect(gcd(7, 13)).toBe(1);
    expect(gcd(0, 5)).toBe(5);
    expect(gcd(10, 0)).toBe(10);
    expect(gcd(-12, 8)).toBe(4);
  });
});

describe('generateWholeNumberProblem', () => {
  it('generates correct addition problems', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateWholeNumberProblem('barneskole');
      if (problem.operation === 'addition') {
        expect(problem.correctAnswer).toBe(problem.num1 + problem.num2);
      }
    }
  });

  it('generates correct subtraction problems with non-negative results', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateWholeNumberProblem('barneskole');
      if (problem.operation === 'subtraction') {
        expect(problem.correctAnswer).toBe(problem.num1 - problem.num2);
        expect(problem.correctAnswer).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('generates correct multiplication problems', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateWholeNumberProblem('ungdomskole');
      if (problem.operation === 'multiplication') {
        expect(problem.correctAnswer).toBe(problem.num1 * problem.num2);
      }
    }
  });

  it('generates division problems with whole number answers', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateWholeNumberProblem('videregående');
      if (problem.operation === 'division') {
        expect(problem.correctAnswer).toBe(problem.num1 / problem.num2);
        expect(problem.num1 % problem.num2).toBe(0);
      }
    }
  });

  it('respects barneskole ranges for addition/subtraction (1–20)', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateWholeNumberProblem('barneskole');
      if (problem.operation === 'addition' || problem.operation === 'subtraction') {
        expect(problem.num1).toBeGreaterThanOrEqual(1);
        expect(problem.num1).toBeLessThanOrEqual(20);
        expect(problem.num2).toBeGreaterThanOrEqual(1);
        expect(problem.num2).toBeLessThanOrEqual(20);
      }
    }
  });

  it('respects ungdomskole ranges for addition/subtraction (10–100)', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateWholeNumberProblem('ungdomskole');
      if (problem.operation === 'addition' || problem.operation === 'subtraction') {
        expect(problem.num1).toBeGreaterThanOrEqual(10);
        expect(problem.num1).toBeLessThanOrEqual(100);
        expect(problem.num2).toBeGreaterThanOrEqual(10);
        expect(problem.num2).toBeLessThanOrEqual(100);
      }
    }
  });

  it('respects videregående ranges for addition/subtraction (50–500)', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateWholeNumberProblem('videregående');
      if (problem.operation === 'addition' || problem.operation === 'subtraction') {
        expect(problem.num1).toBeGreaterThanOrEqual(50);
        expect(problem.num1).toBeLessThanOrEqual(500);
        expect(problem.num2).toBeGreaterThanOrEqual(50);
        expect(problem.num2).toBeLessThanOrEqual(500);
      }
    }
  });
});

describe('generateFractionProblem', () => {
  it('generates fraction addition with correct answer', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateFractionProblem('barneskole');
      if (problem.operation === 'fractionAdd') {
        const val1 = problem.num1Num! / problem.num1Den!;
        const val2 = problem.num2Num! / problem.num2Den!;
        const answerVal = problem.answerNum! / problem.answerDen!;
        expect(answerVal).toBeCloseTo(val1 + val2, 10);
      }
    }
  });

  it('generates fraction subtraction with non-negative results', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateFractionProblem('barneskole');
      if (problem.operation === 'fractionSub') {
        const val1 = problem.num1Num! / problem.num1Den!;
        const val2 = problem.num2Num! / problem.num2Den!;
        expect(val1).toBeGreaterThanOrEqual(val2);
      }
    }
  });

  it('reduces the answer fraction to lowest terms', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateFractionProblem('barneskole');
      const g = gcd(problem.answerNum!, problem.answerDen!);
      expect(g).toBe(1);
    }
  });

  it('uses same denominators on barneskole difficulty', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateFractionProblem('barneskole');
      expect(problem.num1Den).toBe(problem.num2Den);
    }
  });

  it('always generates proper fractions (numerator < denominator)', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateFractionProblem('barneskole');
      expect(problem.num1Num!).toBeLessThan(problem.num1Den!);
      expect(problem.num2Num!).toBeLessThan(problem.num2Den!);
    }
  });

  it('uses denominator range 2–10 on barneskole', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateFractionProblem('barneskole');
      expect(problem.num1Den).toBeGreaterThanOrEqual(2);
      expect(problem.num1Den).toBeLessThanOrEqual(10);
    }
  });

  it('uses denominator range 2–10 on ungdomskole', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateFractionProblem('ungdomskole');
      expect(problem.num1Den).toBeGreaterThanOrEqual(2);
      expect(problem.num1Den).toBeLessThanOrEqual(10);
    }
  });

  it('uses denominator range 2–24 on videregående', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateFractionProblem('videregående');
      expect(problem.num1Den).toBeGreaterThanOrEqual(2);
      expect(problem.num1Den).toBeLessThanOrEqual(24);
    }
  });

  it('generates input fractions in simplest form (GCD = 1)', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateFractionProblem('barneskole');
      expect(gcd(problem.num1Num!, problem.num1Den!)).toBe(1);
      expect(gcd(problem.num2Num!, problem.num2Den!)).toBe(1);
    }
    for (let i = 0; i < 100; i++) {
      const problem = generateFractionProblem('ungdomskole');
      expect(gcd(problem.num1Num!, problem.num1Den!)).toBe(1);
      expect(gcd(problem.num2Num!, problem.num2Den!)).toBe(1);
    }
    for (let i = 0; i < 100; i++) {
      const problem = generateFractionProblem('videregående');
      expect(gcd(problem.num1Num!, problem.num1Den!)).toBe(1);
      expect(gcd(problem.num2Num!, problem.num2Den!)).toBe(1);
    }
  });

  it('barneskole addition results are proper fractions (answerNum <= answerDen)', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateFractionProblem('barneskole');
      if (problem.operation === 'fractionAdd') {
        expect(problem.answerNum!).toBeLessThanOrEqual(problem.answerDen!);
      }
    }
  });
});

describe('generateEquationProblem', () => {
  it('generates equations where correctAnswer satisfies ax ± b = c', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateEquationProblem('ungdomskole');
      const { eqCoeff: a, eqConstant: b, eqResult: c, eqOp, correctAnswer: x } = problem;
      const result = eqOp === '+' ? a! * x + b! : a! * x - b!;
      expect(result).toBe(c!);
    }
  });

  it('generates barneskole equations with coefficient 1', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateEquationProblem('barneskole');
      expect(problem.eqCoeff).toBe(1);
      expect(problem.eqOp).toBe('+');
    }
  });

  it('generates ungdomskole equations with coefficient 2–5', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateEquationProblem('ungdomskole');
      expect(problem.eqCoeff).toBeGreaterThanOrEqual(2);
      expect(problem.eqCoeff).toBeLessThanOrEqual(5);
    }
  });

  it('generates videregående equations with coefficient 3–8', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateEquationProblem('videregående');
      expect(problem.eqCoeff).toBeGreaterThanOrEqual(3);
      expect(problem.eqCoeff).toBeLessThanOrEqual(8);
    }
  });
});

describe('generateProblem', () => {
  it('only generates problems from enabled categories', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateProblem('barneskole', ['whole']);
      expect(problem.isFraction).toBe(false);
      expect(problem.isEquation).toBe(false);
    }
  });

  it('generates fraction problems when only fraction is enabled', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateProblem('barneskole', ['fraction']);
      expect(problem.isFraction).toBe(true);
    }
  });

  it('generates equation problems when only equation is enabled', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateProblem('barneskole', ['equation']);
      expect(problem.isEquation).toBe(true);
    }
  });

  it('generates all types when all categories are enabled', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      const problem = generateProblem('barneskole', ['whole', 'fraction', 'equation']);
      if (problem.isFraction) seen.add('fraction');
      else if (problem.isEquation) seen.add('equation');
      else seen.add('whole');
    }
    expect(seen.size).toBe(3);
  });
});
