import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { Difficulty, ProblemCategory } from '../types';

const difficulties: { value: Difficulty; label: string; description: string }[] = [
  { value: 'barneskole', label: 'Barneskole', description: 'Tall 1–20, enkle brøk' },
  { value: 'ungdomskole', label: 'Ungdomskole', description: 'Tall 10–100, brøk, likninger' },
  { value: 'videregående', label: 'Videregående', description: 'Tall 50–500, komplekse brøk' }
];

const problemCounts = [5, 10, 20];

const categoryOptions: { value: ProblemCategory; label: string; description: string }[] = [
  { value: 'whole', label: 'Heltall', description: '+ − × ÷' },
  { value: 'fraction', label: 'Brøk', description: '½ + ⅓ − ¼' },
  { value: 'equation', label: 'Likninger', description: '2x + 3 = 11' }
];

/** Categories available per difficulty level. */
const availableCategories: Record<Difficulty, ProblemCategory[]> = {
  barneskole: ['whole', 'fraction'],
  ungdomskole: ['whole', 'fraction', 'equation'],
  videregående: ['whole', 'fraction', 'equation']
};

export default function HomePage() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<Difficulty>('barneskole');
  const [count, setCount] = useState(10);
  const [categories, setCategories] = useState<ProblemCategory[]>(['whole', 'fraction']);

  const available = availableCategories[difficulty];

  const handleDifficultyChange = (value: Difficulty) => {
    const newAvailable = availableCategories[value];
    setDifficulty(value);
    // Keep only categories that are available at this level
    setCategories((prev) => prev.filter((c): c is ProblemCategory => newAvailable.includes(c)));
  };

  const toggleCategory = (value: ProblemCategory) => {
    setCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  const startGame = () => {
    if (categories.length === 0) return;
    const cats = categories.join(',');
    navigate(`/play?difficulty=${difficulty}&count=${count}&categories=${cats}`);
  };

  return (
    <div className="page home-page">
      <h1>🧮 Regnespill</h1>
      <p className="subtitle">Øv på regning, brøk og likninger!</p>

      <div className="options">
        {/* Difficulty tabs */}
        <fieldset>
          <legend>Vanskelighetsgrad</legend>
          <div className="tabs">
            {difficulties.map((d) => (
              <button
                key={d.value}
                type="button"
                className={`tab ${difficulty === d.value ? 'active' : ''}`}
                onClick={() => handleDifficultyChange(d.value)}
              >
                <strong>{d.label}</strong>
                <span>{d.description}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Oppgavetyper</legend>
          <div className="option-group">
            {categoryOptions
              .filter((cat) => available.includes(cat.value))
              .map((cat) => (
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
          <legend>Antall oppgaver</legend>
          <div className="option-group">
            {problemCounts.map((c) => (
              <button
                key={c}
                type="button"
                className={`option-card ${count === c ? 'selected' : ''}`}
                onClick={() => setCount(c)}
              >
                <strong>{c} oppgaver</strong>
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
        Start spill
      </button>
    </div>
  );
}
