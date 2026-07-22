import { useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import MathProblemDisplay from '../components/MathProblemDisplay';
import ScoreBoard from '../components/ScoreBoard';
import { useMathGame } from '../components/useMathGame';
import type { Difficulty, ProblemCategory } from '../types';

export default function GamePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const difficulty = (searchParams.get('difficulty') as Difficulty) || 'barneskole';
  const count = Number.parseInt(searchParams.get('count') || '10', 10);
  const categoriesParam = searchParams.get('categories') || 'whole,fraction';
  const categories = categoriesParam.split(',').filter(Boolean) as ProblemCategory[];
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const {
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
    nextProblem
  } = useMathGame(difficulty, count, categories);

  useEffect(() => {
    if (acknowledged && nextBtnRef.current) {
      nextBtnRef.current.focus();
    }
  }, [acknowledged]);

  if (gameOver) {
    navigate(
      `/results?score=${score}&total=${totalProblems}&difficulty=${difficulty}&categories=${categoriesParam}`
    );
    return null;
  }

  return (
    <div className="page game-page">
      <ScoreBoard score={score} current={problemIndex + 1} total={totalProblems} />

      <MathProblemDisplay
        key={problemIndex}
        problem={currentProblem}
        onAnswer={checkAnswer}
        onFractionAnswer={checkFractionAnswer}
        feedback={feedback}
        acknowledged={acknowledged}
        onAcknowledge={acknowledge}
      />

      {acknowledged && (
        <div className="next-section">
          <button type="button" ref={nextBtnRef} className="next-btn" onClick={nextProblem}>
            {problemIndex + 1 >= totalProblems ? 'Se resultater →' : 'Neste oppgave →'}
          </button>
        </div>
      )}

      <Link to="/" className="home-link">
        ← Tilbake hjem
      </Link>
    </div>
  );
}
