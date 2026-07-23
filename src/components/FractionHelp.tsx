import { useState } from 'react';
import type { MathProblem } from '../types';

interface FractionHelpProps {
  problem: MathProblem;
}

function Frac({ n, d }: { n: number; d: number }) {
  return (
    <span className="fraction">
      <span className="fraction-num">{n}</span>
      <span className="fraction-bar" />
      <span className="fraction-den">{d}</span>
    </span>
  );
}

function FracExpr({ parts }: { parts: Array<{ type: 'frac' | 'text' | 'op'; value: string | { n: number; d: number } }> }) {
  return (
    <span className="frac-expr">
      {parts.map((part, index) =>
        part.type === 'frac' ? (
          <Frac
            key={`frac-${index}-${part.value.n}-${part.value.d}`}
            n={part.value.n}
            d={part.value.d}
          />
        ) : (
          <span
            key={`text-${index}-${part.value}`}
            className="frac-text"
          >
            {part.value}
          </span>
        )
      )}
    </span>
  );
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
    <div
      className="help-overlay"
      onClick={() => setIsOpen(false)}
      onKeyDown={() => setIsOpen(false)}
      onKeyPress={() => setIsOpen(false)}
    >
      <div
        className="help-modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={() => setIsOpen(false)}
        onKeyPress={() => setIsOpen(false)}
      >
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
              En brøk skrives som to tall med en strek mellom dem.
              Tallet <strong>over</strong> streken kalles <strong>telleren</strong>.
              Tallet <strong>under</strong> streken kalles <strong>nevneren</strong>.
            </p>
            <p>
              <strong>Nevneren</strong> forteller hvor mange like deler en helhet er delt i.
              <strong>Telleren</strong> forteller hvor mange av delene vi har.
            </p>
            <div className="help-example">
              <FracExpr parts={[
                { type: 'frac', value: { n: 3, d: 4 } },
                { type: 'text', value: ' betyr 3 av 4 like deler' }
              ]} />
            </div>
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
                    <li><strong>Nevneren</strong> er den samme i svaret</li>
                  </>
                ) : (
                  <>
                    <li>Trekk <strong>tellerne</strong> fra hverandre</li>
                    <li><strong>Nevneren</strong> er den samme i svaret</li>
                  </>
                )}
              </ul>
              <div className="help-example">
                <FracExpr parts={[
                  { type: 'text', value: 'Eksempel: ' },
                  { type: 'frac', value: { n: isAddition ? 1 : 2, d: 4 } },
                  { type: 'text', value: isAddition ? ' + ' : ' − ' },
                  { type: 'frac', value: { n: 2, d: 4 } },
                  { type: 'text', value: ' = ' },
                  { type: 'frac', value: { n: isAddition ? 3 : 1, d: 4 } }
                ]} />
              </div>
            </section>
          ) : (
            <section className="help-section highlight">
              <h3>
                {isAddition ? '➕ Legge sammen' : '➖ Trekke fra'} – ulik nevner
              </h3>
              <p>
                Når brøkene har <strong>ulik nevner</strong>, kan du ikke bare legge sammen
                eller trekke fra tellerne. Du må først finne en <strong>fellesnevner</strong>.
              </p>
              <ol>
                <li>
                  <strong>Finn en fellesnevner</strong> — et tall som begge nevnere går opp i.
                  Den enkleste måten er å gange de to nevnere sammen.
                </li>
                <li>
                  <strong>Utvid brøkene</strong> — ganger både teller og nevner med et tall
                  slik at nevneren blir fellesnevneren.
                  Det du gjør med nevneren, <em>må</em> du også gjøre med telleren.
                </li>
                <li>
                  Nå har brøkene samme nevner —{' '}
                  {isAddition ? 'legg sammen' : 'trekk fra'} tellerne.
                  <strong>Nevneren er fellesnevneren.</strong>
                </li>
              </ol>
              <div className="help-example">
                <FracExpr parts={[
                  { type: 'text', value: 'Eksempel: ' },
                  { type: 'frac', value: { n: 1, d: 3 }},
                  { type: 'text', value: ' + ' },
                  { type: 'frac', value: { n: 1, d: 4 }},
                  { type: 'text', value: ' → ' },
                  { type: 'frac', value: { n: 4, d: 12 }},
                  { type: 'text', value: ' + ' },
                  { type: 'frac', value: { n: 3, d: 12 }},
                  { type: 'text', value: ' = ' },
                  { type: 'frac', value: { n: 7, d: 12 }}
                ]} />
                <p className="step-detail">
                  <FracExpr parts={[
                    { type: 'frac', value: { n: 1, d: 3 }},
                    { type: 'text', value: ' × ' },
                    { type: 'frac', value: { n: 4, d: 4 }},
                    { type: 'text', value: ' = ' },
                    { type: 'frac', value: { n: 4, d: 12 }}
                  ]} />
                  {' '}
                  ,
                  {' '}
                  <FracExpr parts={[
                    { type: 'frac', value: { n: 1, d: 4 }},
                    { type: 'text', value: ' × ' },
                    { type: 'frac', value: { n: 3, d: 3 }},
                    { type: 'text', value: ' = ' },
                    { type: 'frac', value: { n: 3, d: 12 }}
                  ]} />
                </p>
              </div>
            </section>
          )}

          <section className="help-section">
            <h3>✂️ Forkorte brøken</h3>
            <p>
              Hvis teller og nevner kan deles på samme tall, bør du forkorte brøken.
              Da får du brøken på <strong>enkleste form</strong>.
            </p>
            <div className="help-example">
              <FracExpr parts={[
                { type: 'text', value: 'Eksempel: ' },
                { type: 'frac', value: { n: 4, d: 8 }},
                { type: 'text', value: ' = ' },
                { type: 'frac', value: { n: 1, d: 2 }},
                { type: 'text', value: ' (teller og nevner delt på 4)' }
              ]} />
            </div>
          </section>

          <section className="help-section">
            <h3>💡 Tips</h3>
            <ul>
              <li>Skriv svaret på <strong>enkleste form</strong> — forkort brøken hvis du kan</li>
              <li>
                Bruk <strong>teller</strong>- og <strong>nevner</strong>-feltene under oppgaven
              </li>
              <li>Trykk <strong>Enter</strong> i nevner-feltet for å sende inn svaret</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
