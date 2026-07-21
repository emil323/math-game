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
      const problem = generateWholeNumberProblem('easy');
      if (problem.operation === 'addition') {
        expect(problem.correctAnswer).toBe(problem.num1 + problem.num2);
      }
    }
  });

  it('generates correct subtraction problems with non-negative results', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateWholeNumberProblem('easy');
      if (problem.operation === 'subtraction') {
        expect(problem.correctAnswer).toBe(problem.num1 - problem.num2);
        expect(problem.correctAnswer).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('generates correct multiplication problems', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateWholeNumberProblem('medium');
      if (problem.operation === 'multiplication') {
        expect(problem.correctAnswer).toBe(problem.num1 * problem.num2);
      }
    }
  });

  it('generates division problems with whole number answers', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateWholeNumberProblem('hard');
      if (problem.operation === 'division') {
        expect(problem.correctAnswer).toBe(problem.num1 / problem.num2);
        expect(problem.num1 % problem.num2).toBe(0);
      }
    }
  });

  it('respects difficulty ranges for addition/subtraction', () => {
    const easy = generateWholeNumberProblem('easy');
    if (easy.operation === 'addition' || easy.operation === 'subtraction') {
      expect(easy.num1).toBeGreaterThanOrEqual(1);
      expect(easy.num1).toBeLessThanOrEqual(10);
      expect(easy.num2).toBeGreaterThanOrEqual(1);
      expect(easy.num2).toBeLessThanOrEqual(10);
    }
  });
});

describe('generateFractionProblem', () => {
  it('generates fraction addition with correct answer', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateFractionProblem('easy');
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
      const problem = generateFractionProblem('easy');
      if (problem.operation === 'fractionSub') {
        const val1 = problem.num1Num! / problem.num1Den!;
        const val2 = problem.num2Num! / problem.num2Den!;
        expect(val1).toBeGreaterThanOrEqual(val2);
      }
    }
  });

  it('reduces the answer fraction to lowest terms', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateFractionProblem('easy');
      const g = gcd(problem.answerNum!, problem.answerDen!);
      expect(g).toBe(1);
    }
  });

  it('uses same denominators on easy difficulty', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateFractionProblem('easy');
      expect(problem.num1Den).toBe(problem.num2Den);
    }
  });
});

describe('generateEquationProblem', () => {
  it('generates equations where correctAnswer satisfies ax + b = c', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateEquationProblem('medium');
      const { eqCoeff: a, eqConstant: b, eqResult: c, eqOp, correctAnswer: x } = problem;
      const result = eqOp === '+' ? a! * x + b! : a! * x - b!;
      expect(result).toBe(c!);
    }
  });

  it('generates easy equations with coefficient 1', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateEquationProblem('easy');
      expect(problem.eqCoeff).toBe(1);
      expect(problem.eqOp).toBe('+');
    }
  });

  it('generates medium equations with coefficient 2-4', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateEquationProblem('medium');
      expect(problem.eqCoeff).toBeGreaterThanOrEqual(2);
      expect(problem.eqCoeff).toBeLessThanOrEqual(4);
    }
  });

  it('generates hard equations with coefficient 3-6', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateEquationProblem('hard');
      expect(problem.eqCoeff).toBeGreaterThanOrEqual(3);
      expect(problem.eqCoeff).toBeLessThanOrEqual(6);
    }
  });
});

describe('generateProblem', () => {
  it('only generates problems from enabled categories', () => {
    for (let i = 0; i < 100; i++) {
      const problem = generateProblem('easy', ['whole']);
      expect(problem.isFraction).toBe(false);
      expect(problem.isEquation).toBe(false);
    }
  });

  it('generates fraction problems when only fraction is enabled', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateProblem('easy', ['fraction']);
      expect(problem.isFraction).toBe(true);
    }
  });

  it('generates equation problems when only equation is enabled', () => {
    for (let i = 0; i < 50; i++) {
      const problem = generateProblem('easy', ['equation']);
      expect(problem.isEquation).toBe(true);
    }
  });

  it('generates all types when all categories are enabled', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      const problem = generateProblem('easy', ['whole', 'fraction', 'equation']);
      if (problem.isFraction) seen.add('fraction');
      else if (problem.isEquation) seen.add('equation');
      else seen.add('whole');
    }
    expect(seen.size).toBe(3);
  });
});
