import type { AnalysisResult } from '@percepcoes/shared';
import { useCopyToClipboard } from '../../../../shared/hooks/useCopyToClipboard';
import { SectionDivider, useToast } from '../../../../shared/ui';
import styles from './results.module.css';

export function PhrasesSection({ categorias }: { categorias: AnalysisResult['categorias'] }) {
  const { copy, copiedKey } = useCopyToClipboard();
  const toast = useToast();

  const onCopy = async (texto: string, key: string) => {
    try {
      await copy(texto, key);
      toast('Frase copiada');
    } catch {
      toast('Não foi possível copiar');
    }
  };

  return (
    <div className={styles.phrases}>
      {categorias.map((cat, ci) => (
        <section key={ci} className={styles.category}>
          <SectionDivider label={cat.nome} color="var(--color-blue)" align="start" />
          {cat.frases.map((f, fi) => {
            const key = `${ci}-${fi}`;
            return (
              <figure
                key={key}
                className={`${styles.phrase} ${copiedKey === key ? styles.copied : ''}`}
              >
                <blockquote className={styles.phraseText}>“{f.texto}”</blockquote>
                <figcaption className={styles.phraseMeta}>
                  {f.especialista && <span className={styles.author}>— {f.especialista}</span>}
                  {f.contexto && <span className={styles.context}>{f.contexto}</span>}
                </figcaption>
                <button
                  type="button"
                  className={styles.copyButton}
                  onClick={() => onCopy(f.texto, key)}
                  aria-label={`Copiar frase: ${f.texto}`}
                >
                  {copiedKey === key ? 'copiado' : 'copiar'}
                </button>
              </figure>
            );
          })}
        </section>
      ))}
    </div>
  );
}
