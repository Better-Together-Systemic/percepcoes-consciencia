import type { CSSProperties, ReactNode } from 'react';
import styles from './Panel.module.css';

export interface PanelTheme {
  accent: string;
  background: string;
  /** Cor sólida atrás do rótulo (deve casar com o início do gradiente). */
  labelBackground: string;
}

interface Props {
  label: string;
  theme: PanelTheme;
  children: ReactNode;
}

/** Bloco de resultado com rótulo sobreposto à borda superior. */
export function Panel({ label, theme, children }: Props) {
  const style = {
    '--panel-accent': theme.accent,
    '--panel-bg': theme.background,
    '--panel-label-bg': theme.labelBackground,
  } as CSSProperties;

  return (
    <section className={styles.panel} style={style}>
      <h3 className={styles.label}>{label}</h3>
      {children}
    </section>
  );
}

export function PanelTitle({ children }: { children: ReactNode }) {
  return <p className={styles.name}>{children}</p>;
}

export function PanelText({ children }: { children: ReactNode }) {
  return <p className={styles.text}>{children}</p>;
}
