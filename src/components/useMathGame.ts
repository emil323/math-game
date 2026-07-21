import { useState, useCallback } from 'react';
import type { MathProblem, Difficulty, Operation } from '../types';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblem(difficulty: Difficulty): MathProblem {
  const operations: Operation[] = ['addition', 'subtraction', 'multiplication', 'division'];
  const operation = operations[randomInt(0, 3)];

  let num1: number;
  let num2: number;

  if (operation === 'multiplication' || operation === 'division') {
    // Smaller ranges for multiplication/division so answers stay reasonable
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
      // Generate clean division: num1 = num2 * answer, so num1 / num2 = answer
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

    // For subtraction, ensure the result is non-negative
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
  }

  return {
    num1,
    num2,
    operation,
    correctAnswer,
    userAnswer: null,
    isCorrect: null,
  };
}

export function useMathGame(difficulty: Difficulty, totalProblems: number) {
  const [currentProblem, setCurrentProblem] = useState<MathProblem>(() =>
    generateProblem(difficulty)
  );
  const [problemIndex, setProblemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);

  const checkAnswer = useCallback(
    (answer: number) => {
      if (feedback !== null) return; // Already answered

      const isCorrect = answer === currentProblem.correctAnswer;
      setCurrentProblem((prev: MathProblem) => ({ ...prev, userAnswer: answer, isCorrect: isCorrect }));
      setFeedback(isCorrect ? 'correct' : 'incorrect');
      // Correct answers can proceed immediately; incorrect require acknowledgment
      setAcknowledged(isCorrect);
      if (isCorrect) setScore((prev: number) => prev + 1);
    },
    [currentProblem.correctAnswer, feedback]
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
    acknowledge,
    nextProblem,
    resetGame,
  };
}
