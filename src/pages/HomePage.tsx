import { useNavigate } from 'react-router';
import { useState } from 'react';
import type { Difficulty, ProblemCategory } from '../types';

const difficulties: { value: Difficulty; label: string; description: string }[] = [
  { value: 'easy', label: 'Easy', description: 'Numbers 1–10' },
  { value: 'medium', label: 'Medium', description: 'Numbers 10–50' },
  { value: 'hard', label: 'Hard', description: 'Numbers 50–100' },
];

const problemCounts = [5, 10, 20];

const categoryOptions: { value: ProblemCategory; label: string; description: string }[] = [
  { value: 'whole', label: 'Whole Numbers', description: '+ − × ÷' },
  { value: 'fraction', label: 'Fractions', description: '½ + ⅓ − ¼' },
  { value: 'equation', label: 'Equations', description: 'x + 5 = 12' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [count, setCount] = useState(10);
  const [categories, setCategories] = useState<ProblemCategory[]>(['whole', 'fraction', 'equation']);

  const toggleCategory = (value: ProblemCategory) => {
    setCategories((prev) =>
      prev.includes(value)
        ? prev.filter((c) => c !== value)
        : [...prev, value],
    );
  };

  const startGame = () => {
    if (categories.length === 0) return;
    const cats = categories.join(',');
    navigate(`/play?difficulty=${difficulty}&count=${count}&categories=${cats}`);
  };

  return (
    <div className="page home-page">
      <h1>🧮 Math Game</h1>
      <p className="subtitle">Practice arithmetic, fractions &amp; equations!</p>

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
          <legend>Problem Types</legend>
          <div className="option-group">
            {categoryOptions.map((cat) => (
              <button
                key={cat.value}
                type="button"
                className={`option-card ${categories.includes(cat.value) ? 'selected' : ''}`}
                onClick={() => toggleCategory(cat.value)}
              >
                <strong>{cat.label}</strong>
                <span>{cat.description}</span>
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

      <button
        type="button"
        className={`play-btn ${categories.length === 0 ? 'disabled' : ''}`}
        onClick={startGame}
        disabled={categories.length === 0}
      >
        Start Game
      </button>
    </div>
  );
}
