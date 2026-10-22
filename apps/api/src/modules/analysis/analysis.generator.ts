import type { AnalysisResult, LinguagemId } from '@percepcoes/shared';

export interface AnalysisInput {
  situacao: string;
  linguagens: LinguagemId[];
}

/** Porta para o provedor de IA — permite trocar o modelo/provedor ou usar um stub em testes. */
export interface AnalysisGenerator {
  generate(input: AnalysisInput): Promise<AnalysisResult>;
}
