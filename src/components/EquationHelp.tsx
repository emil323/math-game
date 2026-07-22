import { useState } from 'react';
import type { MathProblem } from '../types';

interface EquationHelpProps {
  problem: MathProblem;
}

export default function EquationHelp({ problem }: EquationHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasCoefficient = (problem.eqCoeff ?? 1) > 1;
  const isAddition = problem.eqOp === '+';

  // Build example that matches the current problem's structure
  const exCoeff = hasCoefficient ? 2 : 1;
  const exConst = isAddition ? 3 : 5;
  const exX = 4;
  const exResult = isAddition ? exCoeff * exX + exConst : exCoeff * exX - exConst;
  const exCoeffDisplay = exCoeff > 1 ? `${exCoeff}x` : 'x';
  const exOpSymbol = isAddition ? '+' : '−';

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
              Ta ligningen <strong>{exCoeffDisplay} {exOpSymbol} {exConst} = {exResult}</strong>:
            </p>
            <ul>
              <li>
                {isAddition ? `Trekk fra ${exConst}` : `Legg til ${exConst}`} på begge sider:
                {' '}
                {exCoeffDisplay} {exOpSymbol} {exConst}{' '}
                {isAddition ? `− ${exConst}` : `+ ${exConst}`} = {exResult}{' '}
                {isAddition ? `− ${exConst}` : `+ ${exConst}`}
                {' '}→ {exCoeffDisplay} = {exResult - (isAddition ? exConst : -exConst)}
              </li>
              {hasCoefficient && (
                <li>
                  Del på {exCoeff}: {exCoeff}{exCoeffDisplay === 'x' ? 'x' : ''} ÷ {exCoeff} ={' '}
                  {exResult - (isAddition ? exConst : -exConst)} ÷ {exCoeff}
                  {' '}→ <strong>x = {exX}</strong>
                </li>
              )}
              {!hasCoefficient && (
                <li><strong>x = {exX}</strong></li>
              )}
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
