import { useSearchParams, Link } from 'react-router';

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const score = Number.parseInt(searchParams.get('score') || '0', 10);
  const total = Number.parseInt(searchParams.get('total') || '0', 10);
  const difficulty = searchParams.get('difficulty') || 'easy';

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const incorrect = total - score;

  const getMessage = () => {
    if (percentage === 100) return '🏆 Perfect score! Amazing!';
    if (percentage >= 80) return '🌟 Great job! Almost perfect!';
    if (percentage >= 60) return '👍 Good effort! Keep practicing!';
    return '💪 Keep practicing! You will get better!';
  };

  return (
    <div className="page results-page">
      <h1>Results</h1>

      <div className="results-card">
        <p className="results-message">{getMessage()}</p>

        <div className="stats">
          <div className="stat">
            <span className="stat-value correct">{score}</span>
            <span className="stat-label">Correct</span>
          </div>
          <div className="stat">
            <span className="stat-value incorrect">{incorrect}</span>
            <span className="stat-label">Incorrect</span>
          </div>
          <div className="stat">
            <span className="stat-value">{percentage}%</span>
            <span className="stat-label">Score</span>
          </div>
        </div>

        <p className="difficulty-label">Difficulty: {difficulty}</p>
      </div>

      <div className="results-actions">
        <Link
          to={`/play?difficulty=${difficulty}&count=${total}`}
          className="play-btn"
        >
          Play Again
        </Link>
        <Link to="/" className="home-link">
          ← Home
        </Link>
      </div>
    </div>
  );
}
