interface ScoreBoardProps {
  score: number;
  current: number;
  total: number;
}

export default function ScoreBoard({ score, current, total }: ScoreBoardProps) {
  return (
    <div className="scoreboard">
      <div className="score-item">
        <span className="score-label">Score</span>
        <span className="score-value">{score}</span>
      </div>
      <div className="score-item">
        <span className="score-label">Problem</span>
        <span className="score-value">{current} / {total}</span>
      </div>
    </div>
  );
}
