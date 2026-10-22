import type { AnalysisResult } from '@percepcoes/shared';
import { Panel } from '../../../../shared/ui';
import { PANEL_THEMES } from '../../theme';
import styles from './results.module.css';

const NUMERALS = ['①', '②', '③', '④', '⑤'];

export function InvestigationPanel({ perguntas }: { perguntas: AnalysisResult['investigacao'] }) {
  if (perguntas.length === 0) return null;
  return (
    <Panel
      label="Investigação para Reconhecer o que Precisa ser Visto"
      theme={PANEL_THEMES.investigacao}
    >
      <p className={styles.intro}>O que pede lugar. O que ainda não foi visto.</p>
      <ol className={styles.questions}>
        {perguntas.map((q, i) => (
          <li key={i} className={styles.question}>
            <span className={styles.numeral} aria-hidden="true">
              {NUMERALS[i] ?? i + 1}
            </span>
            <div>
              <p className={styles.questionHeader}>
                <span className={styles.questionTheme}>{q.tema}</span>
                <span className={styles.questionSub}>— {q.subtema}</span>
              </p>
              <p className={styles.questionText}>“{q.pergunta}”</p>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
