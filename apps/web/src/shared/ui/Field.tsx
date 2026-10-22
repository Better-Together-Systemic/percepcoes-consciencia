import { useId, type InputHTMLAttributes } from 'react';
import styles from './Field.module.css';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hideLabel?: boolean;
}

export function Field({ label, hideLabel, className, ...input }: Props) {
  const id = useId();
  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label htmlFor={id} className={hideLabel ? 'visually-hidden' : styles.label}>
        {label}
      </label>
      <input id={id} className={styles.input} {...input} />
    </div>
  );
}
