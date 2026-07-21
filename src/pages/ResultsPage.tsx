import { useSearchParams, Link } from 'react-router';

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const score = Number.parseInt(searchParams.get('score') || '0', 10);
  const total = Number.parseInt(searchParams.get('total') || '0', 10);
  const difficulty = searchParams.get('difficulty') || 'easy';

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const incorrect = total - score;

  const difficultyLabels: Record<string, string> = {
    easy: 'Lett',
    medium: 'Middels',
    hard: 'Vanskelig',
  };

  const getMessage = () => {
    if (percentage === 100) return '🏆 Perfekt resultat! Fantastisk!';
    if (percentage >= 80) return '🌟 Flott jobbet! Nesten perfekt!';
    if (percentage >= 60) return '👍 God innsats! Fortsett å øve!';
    return '💪 Hold ut! Du blir bedre!';
  };

  return (
    <div className="page results-page">
      <h1>Resultater</h1>

      <div className="results-card">
        <p className="results-message">{getMessage()}</p>

        <div className="stats">
          <div className="stat">
            <span className="stat-value correct">{score}</span>
            <span className="stat-label">Riktige</span>
          </div>
          <div className="stat">
            <span className="stat-value incorrect">{incorrect}</span>
            <span className="stat-label">Feil</span>
          </div>
          <div className="stat">
            <span className="stat-value">{percentage}%</span>
            <span className="stat-label">Poengsum</span>
          </div>
        </div>

        <p className="difficulty-label">Vanskelighetsgrad: {difficultyLabels[difficulty] || difficulty}</p>
      </div>

      <div className="results-actions">
        <Link
          to={`/play?difficulty=${difficulty}&count=${total}`}
          className="play-btn"
        >
          Spill igjen
        </Link>
        <Link to="/" className="home-link">
          ← Hjem
        </Link>
      </div>
    </div>
  );
}
