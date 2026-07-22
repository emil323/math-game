import { useState } from 'react';
import type { MathProblem } from '../types';

interface EquationHelpProps {
  problem: MathProblem;
}

export default function EquationHelp({ problem }: EquationHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasCoefficient = (problem.eqCoeff ?? 1) > 1;
  const isAddition = problem.eqOp === '+';

  if (!isOpen) {
    return (
      <button
        type="button"
        className="help-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Vis hjelp for ligninger"
      >
        ?
      </button>
    );
  }

  return (
    <div className="help-overlay" onClick={() => setIsOpen(false)}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="help-header">
          <h2>Ligninger</h2>
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
            <h3>📐 Hva er en ligning?</h3>
            <p>
              En ligning er et matematisk uttrykk med et likhetstegn (<strong>=</strong>).
              Den har en venstre side og en høyre side — og de er like store.
            </p>
            <p>
              Å <strong>løse</strong> en ligning betyr å finne ut hvilken verdi den ukjente
              (vanligvis <strong>x</strong>) må ha for at likheten skal stemme.
            </p>
          </section>

          <section className="help-section highlight">
            <h3>🔍 Hvordan løser du ligningen?</h3>
            <p>
              Målet er å få <strong>x</strong> helt alene på den ene siden av likhetstegnet.
              Du gjør dette ved å utføre motregninger:
            </p>
            <ol>
              <li>
                <strong>Fjern tallet som legges til eller trekkes fra</strong> — gjør det
                motsatte på begge sider av likhetstegnet
              </li>
              {hasCoefficient && (
                <li>
                  <strong>Del på tallet som x er ganget med</strong> — gjør det på begge
                  sider av likhetstegnet
                </li>
              )}
            </ol>
            <p className="step-detail">
              Husk: Det du gjør på den ene siden, <em>må</em> du også gjøre på den andre.
            </p>
          </section>

          <section className="help-section">
            <h3>📝 Eksempel</h3>
            <p>
              {hasCoefficient ? (
                <>
                  Ta ligningen <strong>2x + 3 = 11</strong>:
                </>
              ) : (
                <>
                  Ta ligningen <strong>x + 3 = 7</strong>:
                </>
              )}
            </p>
            <ul>
              <li>
                {isAddition ? 'Trekk fra' : 'Legg til'} 3 på begge sider:
                {hasCoefficient ? (
                  <> {isAddition ? '2x + 3 − 3 = 11 − 3' : '2x − 3 + 3 = 11 + 3'} → 2x = 8</>
                ) : (
                  <> {isAddition ? 'x + 3 − 3 = 7 − 3' : 'x − 3 + 3 = 7 + 3'} → x = 4</>
                )}
              </li>
              {hasCoefficient && <li>Del på 2: 2x ÷ 2 = 8 ÷ 2 → <strong>x = 4</strong></li>}
            </ul>
          </section>

          <section className="help-section">
            <h3>💡 Tips</h3>
            <ul>
              <li>
                <strong>Motregning:</strong> + blir til −, − blir til +, × blir til ÷
              </li>
              <li>
                Gjøre <strong>samme operasjon på begge sider</strong> holder ligningen i
                balanse
              </li>
              <li>Skriv inn verdien av <strong>x</strong> i feltet under oppgaven</li>
              <li>Trykk <strong>Enter</strong> for å sende inn svaret</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
