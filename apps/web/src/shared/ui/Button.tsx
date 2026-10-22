import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'danger';
  block?: boolean;
}

export function Button({ size = 'md', variant = 'primary', block, className, ...rest }: Props) {
  const cls = [styles.button, styles[size], styles[variant], block && styles.block, className]
    .filter(Boolean)
    .join(' ');
  return <button type="button" className={cls} {...rest} />;
}
