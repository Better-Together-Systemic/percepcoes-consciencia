import styles from './Brand.module.css';

/** Ornamento + título "Percepções & Consciência" + subtítulo. */
export function Brand({ size = 'lg', as: Tag = 'h1' }: { size?: 'md' | 'lg'; as?: 'h1' | 'div' }) {
  return (
    <div className={styles.brand}>
      <div className={styles.ornament} aria-hidden="true">
        <span className={styles.lineLeft} />
        <span className={styles.diamond} />
        <span className={styles.lineRight} />
      </div>
      <Tag className={`${styles.title} ${styles[size]}`}>
        Percepções & <em>Consciência</em>
      </Tag>
      <p className={styles.subtitle}>Visão Sistêmica</p>
    </div>
  );
}
