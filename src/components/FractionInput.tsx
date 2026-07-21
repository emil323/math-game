interface FractionInputProps {
  onAnswer: (numerator: number, denominator: number) => void;
  disabled: boolean;
}

export default function FractionInput({
  onAnswer,
  disabled,
}: FractionInputProps) {
  return (
    <div className="answer-section">
      <div className="fraction-input">
        <input
          type="number"
          className="answer-input"
          placeholder="Num"
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && !disabled) {
              const numEl = document.querySelector(
                '.fraction-input .answer-input',
              ) as HTMLInputElement;
              const denEl = document.querySelector(
                '.fraction-input .answer-input-den',
              ) as HTMLInputElement;
              if (numEl?.value !== '' && denEl?.value !== '') {
                onAnswer(
                  Number.parseInt(numEl.value, 10),
                  Number.parseInt(denEl.value, 10),
                );
              }
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
          placeholder="Den"
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && !disabled) {
              const numEl = document.querySelector(
                '.fraction-input .answer-input',
              ) as HTMLInputElement;
              const denEl = document.querySelector(
                '.fraction-input .answer-input-den',
              ) as HTMLInputElement;
              if (numEl?.value !== '' && denEl?.value !== '') {
                onAnswer(
                  Number.parseInt(numEl.value, 10),
                  Number.parseInt(denEl.value, 10),
                );
              }
            }
          }}
          disabled={disabled}
        />
      </div>
      <button
        type="button"
        className="submit-btn"
        onClick={() => {
          const numEl = document.querySelector(
            '.fraction-input .answer-input',
          ) as HTMLInputElement;
          const denEl = document.querySelector(
            '.fraction-input .answer-input-den',
          ) as HTMLInputElement;
          if (numEl?.value !== '' && denEl?.value !== '' && !disabled) {
            onAnswer(
              Number.parseInt(numEl.value, 10),
              Number.parseInt(denEl.value, 10),
            );
          }
        }}
        disabled={disabled}
      >
        Submit
      </button>
    </div>
  );
}
