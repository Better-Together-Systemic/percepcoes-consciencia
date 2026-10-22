import type { CSSProperties } from 'react';
import styles from './SectionDivider.module.css';

/** Título centralizado entre duas linhas, ou alinhado à esquerda com uma linha. */
export function SectionDivider({
  label,
  color,
  align = 'center',
}: {
  label: string;
  color: string;
  align?: 'center' | 'start';
}) {
  return (
    <div className={styles.divider} style={{ '--divider-color': color } as CSSProperties}>
      {align === 'center' && <span className={styles.line} />}
      <h3 className={styles.label}>{label}</h3>
      <span className={styles.line} />
    </div>
  );
}
