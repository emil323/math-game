import { useNavigate } from 'react-router';
import { useState } from 'react';
import type { Difficulty } from '../types';

const difficulties: { value: Difficulty; label: string; description: string }[] = [
  { value: 'easy', label: 'Easy', description: 'Numbers 1–10' },
  { value: 'medium', label: 'Medium', description: 'Numbers 10–50' },
  { value: 'hard', label: 'Hard', description: 'Numbers 50–100' },
];

const problemCounts = [5, 10, 20];

export default function HomePage() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [count, setCount] = useState(10);

  const startGame = () => {
    navigate(`/play?difficulty=${difficulty}&count=${count}`);
  };

  return (
    <div className="page home-page">
      <h1>🧮 Math Game</h1>
      <p className="subtitle">Practice addition, subtraction, multiplication, division &amp; fractions!</p>

      <div className="options">
        <fieldset>
          <legend>Difficulty</legend>
          <div className="option-group">
            {difficulties.map((d) => (
              <button
                key={d.value}
                type="button"
                className={`option-card ${difficulty === d.value ? 'selected' : ''}`}
                onClick={() => setDifficulty(d.value)}
              >
                <strong>{d.label}</strong>
                <span>{d.description}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Number of Problems</legend>
          <div className="option-group">
            {problemCounts.map((c) => (
              <button
                key={c}
                type="button"
                className={`option-card ${count === c ? 'selected' : ''}`}
                onClick={() => setCount(c)}
              >
                <strong>{c} Problems</strong>
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <button type="button" className="play-btn" onClick={startGame}>
        Start Game
      </button>
    </div>
  );
}
