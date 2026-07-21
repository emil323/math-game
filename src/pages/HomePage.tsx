import { Link } from 'react-router';
import type { Difficulty } from '../types';

const difficulties: { value: Difficulty; label: string; description: string }[] = [
  { value: 'easy', label: 'Easy', description: 'Numbers 1–10' },
  { value: 'medium', label: 'Medium', description: 'Numbers 10–50' },
  { value: 'hard', label: 'Hard', description: 'Numbers 50–100' },
];

const problemCounts = [5, 10, 20];

export default function HomePage() {
  return (
    <div className="page home-page">
      <h1>🧮 Math Game</h1>
      <p className="subtitle">Practice addition and subtraction!</p>

      <div className="options">
        <fieldset>
          <legend>Difficulty</legend>
          <div className="option-group">
            {difficulties.map((d) => (
              <Link
                key={d.value}
                className="option-card"
                to={`/play?difficulty=${d.value}&count=10`}
              >
                <strong>{d.label}</strong>
                <span>{d.description}</span>
              </Link>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Number of Problems</legend>
          <div className="option-group">
            {problemCounts.map((count) => (
              <Link
                key={count}
                className="option-card"
                to={`/play?difficulty=medium&count=${count}`}
              >
                <strong>{count} Problems</strong>
              </Link>
            ))}
          </div>
        </fieldset>
      </div>

      <Link to="/play" className="play-btn">
        Play with defaults
      </Link>
    </div>
  );
}
