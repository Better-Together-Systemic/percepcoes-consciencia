import { LINGUAGENS, type LinguagemId } from '@percepcoes/shared';
import type { CSSProperties } from 'react';
import { Panel } from '../../../../shared/ui';
import { LINGUAGEM_COLORS, PANEL_THEMES } from '../../theme';
import styles from './results.module.css';

export function LoveLanguagesPanel({ ids }: { ids: LinguagemId[] }) {
  const selected = LINGUAGENS.filter((l) => ids.includes(l.id));
  const [first] = selected;
  if (!first) return null;

  return (
    <Panel
      label="Linguagens do Amor"
      theme={{ ...PANEL_THEMES.linguagens, accent: LINGUAGEM_COLORS[first.id] }}
    >
      {selected.map((l) => (
        <section
          key={l.id}
          className={styles.language}
          style={{ '--lang-color': LINGUAGEM_COLORS[l.id] } as CSSProperties}
        >
          <h4 className={styles.languageName}>{l.nome}</h4>
          {l.frases.map((f) => (
            <p key={f} className={styles.languagePhrase}>
              “{f}”
            </p>
          ))}
          <ul className={`${styles.pills} ${styles.indented}`}>
            {l.raizes.map((r) => (
              <li key={r}>– {r}</li>
            ))}
          </ul>
          <p className={`${styles.root} ${styles.indented} ${styles.inline}`}>{l.fraseChave}</p>
        </section>
      ))}
    </Panel>
  );
}
