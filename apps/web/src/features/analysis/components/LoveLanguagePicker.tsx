import { LINGUAGENS, MAX_LINGUAGENS, type LinguagemId } from '@percepcoes/shared';
import type { CSSProperties } from 'react';
import { LINGUAGEM_COLORS } from '../theme';
import styles from './SituationForm.module.css';

interface Props {
  value: LinguagemId[];
  onChange: (next: LinguagemId[]) => void;
}

function hint(count: number) {
  if (count === 0) return `Selecione até ${MAX_LINGUAGENS}`;
  if (count >= MAX_LINGUAGENS) return 'Máximo atingido';
  return `${count} selecionada${count > 1 ? 's' : ''}`;
}

export function LoveLanguagePicker({ value, onChange }: Props) {
  const toggle = (id: LinguagemId) =>
    onChange(
      value.includes(id) ? value.filter((x) => x !== id) : [...value, id].slice(0, MAX_LINGUAGENS),
    );

  return (
    <fieldset className={`${styles.group} ${styles.languages}`}>
      <div className={styles.languagesHeader}>
        <legend className={`${styles.groupLabel} ${styles.gold}`}>Eu preciso de:</legend>
        <span className={styles.hint} aria-live="polite">
          {hint(value.length)}
        </span>
      </div>
      <div className={styles.languageList}>
        {LINGUAGENS.map((l) => {
          const selected = value.includes(l.id);
          const disabled = !selected && value.length >= MAX_LINGUAGENS;
          return (
            <button
              key={l.id}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              className={styles.language}
              style={{ '--lang-color': LINGUAGEM_COLORS[l.id] } as CSSProperties}
              onClick={() => toggle(l.id)}
            >
              <span className={styles.check} aria-hidden="true" />
              <span className={styles.languageOption}>{l.opcao}</span>
              {selected && <span className={styles.languageName}>{l.nome}</span>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
