import { useState } from 'react';
import type { MathProblem } from '../types';

interface FractionHelpProps {
  problem: MathProblem;
}

export default function FractionHelp({ problem }: FractionHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const sameDenominator = problem.num1Den === problem.num2Den;
  const isAddition = problem.operation === 'fractionAdd';

  if (!isOpen) {
    return (
      <button
        type="button"
        className="help-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Vis hjelp for brøkregning"
      >
        ?
      </button>
    );
  }

  return (
    <div className="help-overlay" onClick={() => setIsOpen(false)}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="help-header">
          <h2>Brøkregning</h2>
          <button
            type="button"
            className="help-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Lukk hjelp"
          >
            ×
          </button>
        </div>

        <div className="help-content">
          <section className="help-section">
            <h3>📐 Hva er en brøk?</h3>
            <p>
              En brøk skrives som to tall (eller bokstaver) som står over hverandre
              med en strek i midten. Det øverste tallet kalles <strong>telleren</strong>.
              Det nederste tallet kalles <strong>nevneren</strong>.
            </p>
            <p>
              Nevneren forteller hvor mange deler enheten er delt inn i. Telleren
              forteller hvor mange slike deler brøken inneholder.
            </p>
          </section>

          {sameDenominator ? (
            <section className="help-section highlight">
              <h3>
                {isAddition ? '➕ Legge sammen' : '➖ Trekke fra'} – samme nevner
              </h3>
              <p>
                Når brøkene har <strong>samme nevner</strong>, er det enkelt:
              </p>
              <ul>
                {isAddition ? (
                  <>
                    <li>Legg sammen <strong>tellerne</strong></li>
                    <li>Behold <strong>nevneren</strong></li>
                  </>
                ) : (
                  <>
                    <li>Trekken <strong>tellerne</strong> fra hverandre</li>
                    <li>Behold <strong>nevneren</strong></li>
                  </>
                )}
              </ul>
              <div className="help-example">
                <p>
                  Eksempel: 1/4 {isAddition ? '+' : '−'} 2/4 ={' '}
                  {isAddition ? '3' : '-1'}/4
                </p>
              </div>
            </section>
          ) : (
            <section className="help-section highlight">
              <h3>
                {isAddition ? '➕ Legge sammen' : '➖ Trekke fra'} – ulik nevner
              </h3>
              <p>
                Når brøkene har <strong>ulik nevner</strong>, må du først finne en{' '}
                <strong>fellesnevner</strong>:
              </p>
              <ol>
                <li>Finn en fellesnevner (ofte produktet av de to nevnerne)</li>
                <li>
                  <strong>Utvid</strong> hver brøk: Ganger både teller og nevner med
                  samme tall
                </li>
                <li>
                  Nå har brøkene samme nevner —{' '}
                  {isAddition ? 'legg sammen' : 'trekk fra'} tellerne
                </li>
              </ol>
              <div className="help-example">
                <p>
                  Eksempel: 1/3 + 1/4 → 4/12 + 3/12 = 7/12
                </p>
                <p className="step-detail">
                  1/3 × 4/4 = 4/12, 1/4 × 3/3 = 3/12
                </p>
              </div>
            </section>
          )}

          <section className="help-section">
            <h3>✂️ Forkorte brøken</h3>
            <p>
              Del både teller og nevner på samme tall for å få brøken på{' '}
              <strong>enkleste form</strong>.
            </p>
            <div className="help-example">
              <p>Eksempel: 4/8 = 1/2 (delt på 4)</p>
            </div>
          </section>

          <section className="help-section">
            <h3>💡 Tips</h3>
            <ul>
              <li>Skriv svaret på <strong>enkleste form</strong> (forkortet)</li>
              <li>
                Bruk <strong>teller</strong> og <strong>nevner</strong>-feltene under
                oppgaven
              </li>
              <li>Trykk <strong>Enter</strong> i nevner-feltet for å sende inn</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
