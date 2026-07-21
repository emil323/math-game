import type { MathProblem } from '../types';
import { useEffect, useRef } from 'react';

interface MathProblemDisplayProps {
  problem: MathProblem;
  onAnswer: (answer: number) => void;
  feedback: 'correct' | 'incorrect' | null;
  acknowledged: boolean;
  onAcknowledge: () => void;
}

export default function MathProblemDisplay({
  problem,
  onAnswer,
  feedback,
  acknowledged,
  onAcknowledge,
}: MathProblemDisplayProps) {
  const operator =
    problem.operation === 'addition'
      ? '+'
      : problem.operation === 'subtraction'
        ? '−'
        : problem.operation === 'multiplication'
          ? '×'
          : '÷';
  const ackBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (feedback === 'incorrect' && !acknowledged && ackBtnRef.current) {
      ackBtnRef.current.focus();
    }
  }, [feedback, acknowledged]);

  return (
    <div className="problem-card">
      <div className="problem-text">
        <span className="operand">{problem.num1}</span>
        <span className="operator">{operator}</span>
        <span className="operand">{problem.num2}</span>
        <span className="equals">=</span>
        <span className="question-mark">?</span>
      </div>

      <div className="answer-section">
        <input
          type="number"
          className="answer-input"
          placeholder="Your answer"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !feedback) {
              const value = (e.target as HTMLInputElement).value;
              if (value !== '') {
                onAnswer(Number.parseInt(value, 10));
              }
            }
          }}
          disabled={feedback !== null}
          // biome-ignore lint/a11y/noAutofocus: autoFocus is needed for keyboard UX
          autoFocus
        />
        <button
          type="button"
          className="submit-btn"
          onClick={() => {
            const input = document.querySelector('.answer-input') as HTMLInputElement;
            if (input && input.value !== '' && !feedback) {
              onAnswer(Number.parseInt(input.value, 10));
            }
          }}
          disabled={feedback !== null}
        >
          Submit
        </button>
      </div>

      {feedback === 'correct' && (
        <div className="feedback correct">
          🎉 Correct!
        </div>
      )}

      {feedback === 'incorrect' && !acknowledged && (
        <div className="feedback incorrect">
          <p>❌ Wrong! The answer was <strong>{problem.correctAnswer}</strong></p>
          <button ref={ackBtnRef} type="button" className="acknowledge-btn" onClick={onAcknowledge}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
