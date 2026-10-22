import { Brand } from '../../shared/ui';
import { useAnalyze } from './api';
import { ResultsView } from './components/results/ResultsView';
import { SituationForm } from './components/SituationForm';
import styles from './AnalysisPage.module.css';

export function AnalysisPage() {
  const analyze = useAnalyze();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Brand />
      </header>

      <SituationForm
        busy={analyze.isPending}
        onSubmit={(situacao, linguagens) => analyze.mutate({ situacao, linguagens })}
      />

      <div aria-live="polite">
        {analyze.isPending && (
          <p className={styles.status}>Analisando a dinâmica sistêmica • • •</p>
        )}
      </div>

      {analyze.isError && (
        <p role="alert" className={styles.error}>
          ⚠ {analyze.error.message}
        </p>
      )}

      {analyze.isSuccess && (
        <ResultsView result={analyze.data} linguagens={analyze.variables.linguagens ?? []} />
      )}

      {analyze.isIdle && (
        <div className={styles.empty}>
          <span className={styles.emptyIcon} aria-hidden="true">
            ◇
          </span>
          <p>Descreva a situação acima para gerar percepções sistêmicas</p>
        </div>
      )}
    </main>
  );
}
