import { FERIDAS, type FeridaNome } from '@percepcoes/shared';
import type { CSSProperties } from 'react';
import { Panel, PanelText, PanelTitle } from '../../../../shared/ui';
import { FERIDA_THEMES, PANEL_THEMES } from '../../theme';
import styles from './results.module.css';

export function WoundsPanel({ feridas }: { feridas: FeridaNome[] }) {
  const items = FERIDAS.filter((f) => feridas.includes(f.nome));
  const [first] = items;
  if (!first) return null;

  if (items.length === 1) {
    return (
      <Panel label="Feridas Emocionais" theme={FERIDA_THEMES[first.nome]}>
        <PanelTitle>{first.nome}</PanelTitle>
        <PanelText>{first.desc}</PanelText>
      </Panel>
    );
  }

  return (
    <Panel
      label="Feridas Emocionais"
      theme={{ ...PANEL_THEMES.feridasMultiplas, accent: FERIDA_THEMES[first.nome].accent }}
    >
      <ul className={styles.dotList}>
        {items.map((f) => (
          <li key={f.nome} style={{ '--dot': FERIDA_THEMES[f.nome].accent } as CSSProperties}>
            <p className={styles.dotTitle}>{f.nome}</p>
            <p className={styles.dotText}>{f.desc}</p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
