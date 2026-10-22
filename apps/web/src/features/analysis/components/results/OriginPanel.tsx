import { ORIGENS, type OrigemNome } from '@percepcoes/shared';
import { Panel, PanelTitle } from '../../../../shared/ui';
import { ORIGEM_THEMES } from '../../theme';
import styles from './results.module.css';

export function OriginPanel({ origem }: { origem: OrigemNome }) {
  const info = ORIGENS.find((o) => o.nome === origem);
  if (!info) return null;

  return (
    <Panel label="Origens Sistêmicas do Sofrimento" theme={ORIGEM_THEMES[info.nome]}>
      <PanelTitle>{info.nome}</PanelTitle>
      <p className={styles.description}>{info.desc}</p>
      <ul className={styles.pills}>
        {info.sintomas.map((s) => (
          <li key={s}>– {s}</li>
        ))}
      </ul>
      <p className={styles.root}>
        <span className={styles.rootLabel}>Raiz</span>
        <span>{info.raiz}</span>
      </p>
    </Panel>
  );
}
