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
              Tenk på den som en <strong>vekt</strong> — begge sider må være i balanse.
            </p>
            <p>
              Å <strong>løse</strong> ligningen betyr å finne ut hvilken verdi <strong>x</strong>
              må ha for at balansen skal holde.
            </p>
          </section>

          <section className="help-section highlight">
            <h3>🔍 Slik løser du ligningen</h3>
            <p>
              Målet er alltid det samme: <strong>få x helt alene</strong> på den ene siden.
              Du gjør dette ved å fjerne leddene rundt x, ett steg om gangen.
            </p>
            <ol>
              <li>
                <strong>Fjern tallleddet først</strong> — gjør det motsatte på begge sider
              </li>
              {hasCoefficient && (
                <li>
                  <strong>Fjern ganging</strong> — del på tallet x er ganget med, på begge sider
                </li>
              )}
            </ol>
            <p className="step-detail">
              Hovedregel: Det du gjør på den ene siden, <em>må</em> du gjøre på den andre.
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
            <h3>💡 Huskeregler</h3>
            <p>For å fjerne et ledd, gjør det motsatte:</p>
            <ul>
              <li><strong>+</strong> fjernes med <strong>−</strong></li>
              <li><strong>−</strong> fjernes med <strong>+</strong></li>
              <li><strong>×</strong> fjernes med <strong>÷</strong></li>
              <li><strong>÷</strong> fjernes med <strong>×</strong></li>
            </ul>
            <p className="step-detail">
              Og husk: Siden ligningen er som en vekt, må du gjøre <strong>samme operasjon på
              begge sider</strong> av likhetstegnet.
            </p>
          </section>

          <section className="help-section">
            <h3>🎮 I spillet</h3>
            <ul>
              <li>Skriv inn verdien av <strong>x</strong> i feltet under oppgaven</li>
              <li>Trykk <strong>Enter</strong> for å sende inn svaret</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
