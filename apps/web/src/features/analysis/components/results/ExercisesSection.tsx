import type { AnalysisResult } from '@percepcoes/shared';
import { useId, useState } from 'react';
import { Panel, SectionDivider } from '../../../../shared/ui';
import { PANEL_THEMES } from '../../theme';
import styles from './results.module.css';

const ICONS = ['◈', '◉', '◎', '◇', '◆'];
type Exercicio = AnalysisResult['exercicios'][number];

function Exercise({ ex, index }: { ex: Exercicio; index: number }) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();

  return (
    <div className={`${styles.exercise} ${ex.sensorial ? styles.sensorial : ''}`}>
      {ex.sensorial && (
        <SectionDivider label="✦ Exercício Sensorial · O que Cura" color="#c8a8d8" />
      )}
      <button
        type="button"
        className={styles.exerciseToggle}
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.exerciseIcon} aria-hidden="true">
          {ex.sensorial ? '✦' : ICONS[index % ICONS.length]}
        </span>
        <span className={styles.exerciseTitle}>{ex.titulo}</span>
        <span className={styles.chevron} aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <div id={bodyId} className={styles.exerciseBody}>
          <p className={styles.exerciseText}>{ex.descricao}</p>
          <p className={styles.intention}>
            <span className={styles.intentionLabel}>Intenção</span>
            <span>{ex.intencao}</span>
          </p>
        </div>
      )}
    </div>
  );
}

export function ExercisesSection({ exercicios }: { exercicios: AnalysisResult['exercicios'] }) {
  if (exercicios.length === 0) return null;
  return (
    <section className={styles.exercises}>
      <SectionDivider label="Práticas & Exercícios" color="rgba(168,200,160,0.8)" />
      <Panel
        label="Exercícios de Ressignificação · Inclusão · Reparação"
        theme={PANEL_THEMES.exercicios}
      >
        <p className={styles.introGreen}>
          Para que o que ficou parado possa se mover. Para que a vida flua.
        </p>
        {exercicios.map((ex, i) => (
          <Exercise key={i} ex={ex} index={i} />
        ))}
      </Panel>
    </section>
  );
}
