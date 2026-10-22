import { selecionarMusicas, type AnalysisResult, type Musica } from '@percepcoes/shared';
import { useMemo } from 'react';
import { Panel } from '../../../../shared/ui';
import { PANEL_THEMES } from '../../theme';
import styles from './results.module.css';

function MusicCard({ label, musica, motivo }: { label: string; musica: Musica; motivo: string }) {
  return (
    <div className={styles.music}>
      <p className={styles.musicLabel}>{label}</p>
      <p className={styles.musicTitle}>{musica.titulo}</p>
      <p className={styles.musicArtist}>{musica.artista}</p>
      {motivo && <p className={styles.musicReason}>{motivo}</p>}
      <a
        className={styles.musicLink}
        href={`https://www.youtube.com/watch?v=${encodeURIComponent(musica.youtubeId)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className={styles.play} aria-hidden="true">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6,3 20,12 6,21" />
          </svg>
        </span>
        Ouvir no YouTube
        <span className="visually-hidden"> (abre em nova aba)</span>
      </a>
    </div>
  );
}

export function MusicPanel({ result }: { result: AnalysisResult }) {
  // As músicas são escolhidas aqui, a partir da dinâmica e das feridas, e não pela IA.
  const { nacional, internacional } = useMemo(() => selecionarMusicas(result), [result]);

  return (
    <Panel label="Músicas Sistêmicas" theme={PANEL_THEMES.musicas}>
      <div className={styles.musicRow}>
        <MusicCard label="Nacional" {...nacional} />
        <MusicCard label="Internacional" {...internacional} />
      </div>
    </Panel>
  );
}
