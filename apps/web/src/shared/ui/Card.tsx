import type { ReactNode } from 'react';
import styles from './Card.module.css';

interface Props {
  title?: string;
  accent?: 'gold' | 'blue';
  children: ReactNode;
  className?: string;
}

/** Superfície com filete de destaque no topo. */
export function Card({ title, accent = 'gold', children, className }: Props) {
  return (
    <section className={[styles.card, styles[accent], className].filter(Boolean).join(' ')}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {children}
    </section>
  );
}
