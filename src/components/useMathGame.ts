// React game state management — imports pure logic from problemGenerator
import { useCallback, useState } from 'react';
import type { Difficulty, MathProblem, ProblemCategory } from '../types';
import { gcd, generateProblem } from './problemGenerator';

export function useMathGame(
  difficulty: Difficulty,
  totalProblems: number,
  categories: ProblemCategory[]
) {
  const [currentProblem, setCurrentProblem] = useState<MathProblem>(() =>
    generateProblem(difficulty, categories)
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
        isCorrect: isCorrect
      }));
      setFeedback(isCorrect ? 'correct' : 'incorrect');
      setAcknowledged(isCorrect);
      if (isCorrect) {
        setScore((prev: number) => prev + 1);
      }
    },
    [currentProblem.correctAnswer, feedback]
  );

  const checkFractionAnswer = useCallback(
    (userNum: number, userDen: number) => {
      if (feedback !== null) return;
      if (userDen === 0) return;

      const userGcd = gcd(userNum, userDen);
      const reducedUserNum = userNum / userGcd;
      const reducedUserDen = userDen / userGcd;

      const isCorrect =
        reducedUserNum === currentProblem.answerNum && reducedUserDen === currentProblem.answerDen;

      setCurrentProblem((prev: MathProblem) => ({
        ...prev,
        userAnswerNum: userNum,
        userAnswerDen: userDen,
        isCorrect: isCorrect
      }));
      setFeedback(isCorrect ? 'correct' : 'incorrect');
      setAcknowledged(isCorrect);
      if (isCorrect) {
        setScore((prev: number) => prev + 1);
      }
    },
    [currentProblem.answerNum, currentProblem.answerDen, feedback]
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
    setCurrentProblem(generateProblem(difficulty, categories));
    setFeedback(null);
    setAcknowledged(false);
  }, [problemIndex, totalProblems, difficulty, categories]);

  const resetGame = useCallback(() => {
    setCurrentProblem(generateProblem(difficulty, categories));
    setProblemIndex(0);
    setScore(0);
    setGameOver(false);
    setFeedback(null);
    setAcknowledged(false);
  }, [difficulty, categories]);

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
    resetGame
  };
}
