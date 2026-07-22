interface FractionInputProps {
  onAnswer: (numerator: number, denominator: number) => void;
  disabled: boolean;
}

export default function FractionInput({ onAnswer, disabled }: FractionInputProps) {
  const handleSubmit = () => {
    const numEl = document.querySelector(
      '.fraction-input .answer-input'
    ) as HTMLInputElement;
    const denEl = document.querySelector(
      '.fraction-input .answer-input-den'
    ) as HTMLInputElement;
    if (numEl?.value !== '' && denEl?.value !== '' && !disabled) {
      onAnswer(Number.parseInt(numEl.value, 10), Number.parseInt(denEl.value, 10));
    }
  };

  return (
    <div className="answer-section">
      <div className="fraction-input">
        <input
          type="number"
          className="answer-input"
          placeholder="Teller"
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && !disabled) {
              // Move focus to denominator on Enter from numerator
              const denEl = document.querySelector(
                '.fraction-input .answer-input-den'
              ) as HTMLInputElement;
              denEl?.focus();
            }
          }}
          disabled={disabled}
          // biome-ignore lint/a11y/noAutofocus: autoFocus is needed for keyboard UX
          autoFocus
        />
        <div className="fraction-bar" />
        <input
          type="number"
          className="answer-input answer-input-den"
          placeholder="Nevner"
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && !disabled) {
              handleSubmit();
            }
          }}
          disabled={disabled}
        />
      </div>
      <button
        type="button"
        className="submit-btn"
        onClick={handleSubmit}
        disabled={disabled}
      >
        Send inn
      </button>
    </div>
  );
}
