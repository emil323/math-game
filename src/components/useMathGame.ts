import { useState, useCallback } from 'react';
import type { MathProblem, Difficulty, Operation } from '../types';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(aParam: number, bParam: number): number {
  let a = Math.abs(aParam);
  let b = Math.abs(bParam);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function generateProblem(difficulty: Difficulty): MathProblem {
  // ~50% chance of a fraction problem
  const isFraction = Math.random() < 0.5;

  if (isFraction) {
    return generateFractionProblem(difficulty);
  }

  return generateWholeNumberProblem(difficulty);
}

function generateFractionProblem(difficulty: Difficulty): MathProblem {
  const operation: Operation =
    Math.random() < 0.5 ? 'fractionAdd' : 'fractionSub';

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

  // For subtraction, ensure non-negative result by swapping if needed
  if (operation === 'fractionSub') {
    const val1 = num1Num / num1Den;
    const val2 = num2Num / num2Den;
    if (val1 < val2) {
      [num1Num, num2Num] = [num2Num, num1Num];
      [num1Den, num2Den] = [num2Den, num1Den];
    }
  }

  // Compute answer: common denominator = num1Den * num2Den
  const commonDen = num1Den * num2Den;
  const an =
    operation === 'fractionAdd'
      ? num1Num * num2Den + num2Num * num1Den
      : num1Num * num2Den - num2Num * num1Den;

  // Reduce the answer fraction
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
    answerDen,
  };
}

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
  };
}

export function useMathGame(difficulty: Difficulty, totalProblems: number) {
  const [currentProblem, setCurrentProblem] = useState<MathProblem>(() =>
    generateProblem(difficulty),
  );
  const [problemIndex, setProblemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);

  const checkAnswer = useCallback(
    (answer: number) => {
      if (feedback !== null) return;

      const isCorrect = answer === currentProblem.correctAnswer;
      setCurrentProblem((prev: MathProblem) => ({
        ...prev,
        userAnswer: answer,
        isCorrect: isCorrect,
      }));
      setFeedback(isCorrect ? 'correct' : 'incorrect');
      setAcknowledged(isCorrect);
      if (isCorrect) {
        setScore((prev: number) => prev + 1);
      }
    },
    [currentProblem.correctAnswer, feedback],
  );

  const checkFractionAnswer = useCallback(
    (userNum: number, userDen: number) => {
      if (feedback !== null) return;
      if (userDen === 0) return;

      // Reduce user's answer
      const userGcd = gcd(userNum, userDen);
      const reducedUserNum = userNum / userGcd;
      const reducedUserDen = userDen / userGcd;

      const isCorrect =
        reducedUserNum === currentProblem.answerNum &&
        reducedUserDen === currentProblem.answerDen;

      setCurrentProblem((prev: MathProblem) => ({
        ...prev,
        userAnswerNum: userNum,
        userAnswerDen: userDen,
        isCorrect: isCorrect,
      }));
      setFeedback(isCorrect ? 'correct' : 'incorrect');
      setAcknowledged(isCorrect);
      if (isCorrect) {
        setScore((prev: number) => prev + 1);
      }
    },
    [currentProblem.answerNum, currentProblem.answerDen, feedback],
  );

  const acknowledge = useCallback(() => {
    setAcknowledged(true);
  }, []);

  const nextProblem = useCallback(() => {
    if (problemIndex + 1 >= totalProblems) {
      setGameOver(true);
      return;
    }
    setProblemIndex((prev: number) => prev + 1);
    setCurrentProblem(generateProblem(difficulty));
    setFeedback(null);
    setAcknowledged(false);
  }, [problemIndex, totalProblems, difficulty]);

  const resetGame = useCallback(() => {
    setCurrentProblem(generateProblem(difficulty));
    setProblemIndex(0);
    setScore(0);
    setGameOver(false);
    setFeedback(null);
    setAcknowledged(false);
  }, [difficulty]);

  return {
    currentProblem,
    problemIndex,
    score,
    totalProblems,
    gameOver,
    feedback,
    acknowledged,
    checkAnswer,
    checkFractionAnswer,
    acknowledge,
    nextProblem,
    resetGame,
  };
}
