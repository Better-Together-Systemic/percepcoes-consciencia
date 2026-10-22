import { DINAMICAS, LEIS, type AnalysisResult, type LinguagemId } from '@percepcoes/shared';
import { Panel, PanelText, PanelTitle } from '../../../../shared/ui';
import { PANEL_THEMES } from '../../theme';
import { ExercisesSection } from './ExercisesSection';
import { InvestigationPanel } from './InvestigationPanel';
import { LoveLanguagesPanel } from './LoveLanguagesPanel';
import { MusicPanel } from './MusicPanel';
import { OriginPanel } from './OriginPanel';
import { PhrasesSection } from './PhrasesSection';
import { WoundsPanel } from './WoundsPanel';
import styles from './results.module.css';

interface Props {
  result: AnalysisResult;
  linguagens: LinguagemId[];
}

export function ResultsView({ result, linguagens }: Props) {
  const dinamica = DINAMICAS.find((d) => d.nome === result.dinamica);
  const lei = LEIS.find((l) => l.nome === result.lei);

  return (
    <article className={styles.results} aria-label="Resultado da análise">
      <Panel label="Dinâmica Sistêmica" theme={PANEL_THEMES.dinamica}>
        <PanelTitle>{result.dinamica}</PanelTitle>
        {dinamica && <PanelText>{dinamica.desc}</PanelText>}
      </Panel>

      <Panel label="Leitura Sistêmica" theme={PANEL_THEMES.reflexao}>
        <p className={styles.reflection}>{result.reflexao}</p>
      </Panel>

      <Panel label="Lei Sistêmica" theme={PANEL_THEMES.lei}>
        <PanelTitle>{result.lei}</PanelTitle>
        {lei && <PanelText>{lei.desc}</PanelText>}
      </Panel>

      <WoundsPanel feridas={result.feridas} />
      <OriginPanel origem={result.origem} />
      <InvestigationPanel perguntas={result.investigacao} />
      <LoveLanguagesPanel ids={linguagens} />
      <PhrasesSection categorias={result.categorias} />
      <ExercisesSection exercicios={result.exercicios} />
      <MusicPanel result={result} />
    </article>
  );
}
