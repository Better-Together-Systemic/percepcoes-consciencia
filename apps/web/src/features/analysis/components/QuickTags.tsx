import { ATALHOS } from '@percepcoes/shared';
import styles from './SituationForm.module.css';

export function QuickTags({ onPick }: { onPick: (situacao: string) => void }) {
  return (
    <fieldset className={styles.group}>
      <legend className={styles.groupLabel}>Atalhos rápidos</legend>
      <div className={styles.tags}>
        {ATALHOS.map((a) => (
          <button
            key={a.label}
            type="button"
            className={styles.tag}
            onClick={() => onPick(a.situacao)}
          >
            {a.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
