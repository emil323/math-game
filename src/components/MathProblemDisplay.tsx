import type { MathProblem } from '../types';
import { useEffect, useRef } from 'react';
import FractionInput from './FractionInput';

interface MathProblemDisplayProps {
  problem: MathProblem;
  onAnswer: (answer: number) => void;
  onFractionAnswer: (numerator: number, denominator: number) => void;
  feedback: 'correct' | 'incorrect' | null;
  acknowledged: boolean;
  onAcknowledge: () => void;
}

export default function MathProblemDisplay({
  problem,
  onAnswer,
  onFractionAnswer,
  feedback,
  acknowledged,
  onAcknowledge,
}: MathProblemDisplayProps) {
  const operator = getOperator(problem.operation);
  const ackBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (feedback === 'incorrect' && !acknowledged && ackBtnRef.current) {
      ackBtnRef.current.focus();
    }
  }, [feedback, acknowledged]);

  const correctAnswerText = getCorrectAnswerText(problem);
  const isFraction = problem.isFraction === true;
  const isEquation = problem.isEquation === true;

  return (
    <div className="problem-card">
      {isFraction ? (
        <FractionProblemDisplay problem={problem} />
      ) : isEquation ? (
        <EquationProblemDisplay problem={problem} />
      ) : (
        <WholeNumberProblemDisplay problem={problem} operator={operator} />
      )}

      {isFraction ? (
        <FractionInput
          onAnswer={onFractionAnswer}
          disabled={feedback !== null}
        />
      ) : (
        <div className="answer-section">
          <input
            type="number"
            className="answer-input"
            placeholder={isEquation ? 'Value of x' : 'Your answer'}
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
              const input = document.querySelector(
                '.answer-input',
              ) as HTMLInputElement;
              if (input && input.value !== '' && !feedback) {
                onAnswer(Number.parseInt(input.value, 10));
              }
            }}
            disabled={feedback !== null}
          >
            Submit
          </button>
        </div>
      )}

      {feedback === 'correct' && (
        <div className="feedback correct">🎉 Correct!</div>
      )}

      {feedback === 'incorrect' && !acknowledged && (
        <div className="feedback incorrect">
          <p>
            ❌ Wrong! The answer was{' '}
            {isFraction && problem.answerNum !== undefined && problem.answerDen !== undefined ? (
              <span className="inline-fraction">
                <FractionDisplay numerator={problem.answerNum} denominator={problem.answerDen} />
              </span>
            ) : (
              <strong>{correctAnswerText}</strong>
            )}
          </p>
          <button
            ref={ackBtnRef}
            type="button"
            className="acknowledge-btn"
            onClick={onAcknowledge}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}

function getOperator(operation: MathProblem['operation']): string {
  if (operation === 'addition' || operation === 'fractionAdd') {
    return '+';
  }
  if (operation === 'subtraction' || operation === 'fractionSub') {
    return '−';
  }
  if (operation === 'multiplication') {
    return '×';
  }
  return '÷';
}

function getCorrectAnswerText(problem: MathProblem): string {
  if (problem.isFraction && problem.answerNum !== undefined && problem.answerDen !== undefined) {
    if (problem.answerDen === 1) {
      return String(problem.answerNum);
    }
    return `${problem.answerNum}/${problem.answerDen}`;
  }
  return String(problem.correctAnswer);
}

interface FractionDisplayProps {
  numerator: number;
  denominator: number;
}

function FractionDisplay({ numerator, denominator }: FractionDisplayProps) {
  return (
    <div className="fraction">
      <span className="fraction-num">{numerator}</span>
      <span className="fraction-bar" />
      <span className="fraction-den">{denominator}</span>
    </div>
  );
}

function FractionProblemDisplay({ problem }: { problem: MathProblem }) {
  const operator = getOperator(problem.operation);

  return (
    <div className="problem-text">
      <FractionDisplay
        numerator={problem.num1Num!}
        denominator={problem.num1Den!}
      />
      <span className="operator">{operator}</span>
      <FractionDisplay
        numerator={problem.num2Num!}
        denominator={problem.num2Den!}
      />
      <span className="equals">=</span>
      <span className="question-mark">?</span>
    </div>
  );
}

function WholeNumberProblemDisplay({
  problem,
  operator,
}: {
  problem: MathProblem;
  operator: string;
}) {
  return (
    <div className="problem-text">
      <span className="operand">{problem.num1}</span>
      <span className="operator">{operator}</span>
      <span className="operand">{problem.num2}</span>
      <span className="equals">=</span>
      <span className="question-mark">?</span>
    </div>
  );
}

function EquationProblemDisplay({ problem }: { problem: MathProblem }) {
  if (problem.operation === 'equationAdd') {
    // x + num2 = num1
    return (
      <div className="problem-text">
        <span className="variable">x</span>
        <span className="operator">+</span>
        <span className="operand">{problem.num2}</span>
        <span className="equals">=</span>
        <span className="operand">{problem.num1}</span>
      </div>
    );
  }

  if (problem.operation === 'equationSub') {
    // x - num2 = num1
    return (
      <div className="problem-text">
        <span className="variable">x</span>
        <span className="operator">−</span>
        <span className="operand">{problem.num2}</span>
        <span className="equals">=</span>
        <span className="operand">{problem.num1}</span>
      </div>
    );
  }

  // equationMul: num1 × x = num2
  return (
    <div className="problem-text">
      <span className="operand">{problem.num1}</span>
      <span className="operator">×</span>
      <span className="variable">x</span>
      <span className="equals">=</span>
      <span className="operand">{problem.num2}</span>
    </div>
  );
}
