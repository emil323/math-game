import { useSearchParams, useNavigate, Link } from 'react-router';
import { useEffect, useRef } from 'react';
import type { Difficulty } from '../types';
import { useMathGame } from '../components/useMathGame';
import MathProblemDisplay from '../components/MathProblemDisplay';
import ScoreBoard from '../components/ScoreBoard';

export default function GamePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const difficulty = (searchParams.get('difficulty') as Difficulty) || 'easy';
  const count = Number.parseInt(searchParams.get('count') || '10', 10);
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
    nextProblem,
  } = useMathGame(difficulty, count);

  useEffect(() => {
    if (acknowledged && nextBtnRef.current) {
      nextBtnRef.current.focus();
    }
  }, [acknowledged]);

  if (gameOver) {
    navigate(`/results?score=${score}&total=${totalProblems}&difficulty=${difficulty}`);
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
            {problemIndex + 1 >= totalProblems ? 'See Results →' : 'Next Problem →'}
          </button>
        </div>
      )}

      <Link to="/" className="home-link">
        ← Back to Home
      </Link>
    </div>
  );
}
