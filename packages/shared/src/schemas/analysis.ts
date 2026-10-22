import { z } from 'zod';
import { DINAMICAS, FERIDAS, LEIS, LINGUAGENS, MAX_LINGUAGENS, ORIGENS } from '../catalog';
import { SITUACAO_MAX_LENGTH } from '../constants';

type NonEmpty<T> = [T, ...T[]];
const names = <T extends { nome: string }>(items: readonly T[]) =>
  items.map((i) => i.nome) as NonEmpty<T['nome']>;
const ids = <T extends { id: string }>(items: readonly T[]) =>
  items.map((i) => i.id) as NonEmpty<T['id']>;

/** Corpo do POST /api/analysis. */
export const analysisRequestSchema = z.object({
  situacao: z
    .string()
    .trim()
    .min(10, 'Descreva a situação com um pouco mais de detalhe.')
    .max(SITUACAO_MAX_LENGTH, `Use no máximo ${SITUACAO_MAX_LENGTH} caracteres.`),
  linguagens: z
    .array(z.enum(ids(LINGUAGENS)))
    .max(MAX_LINGUAGENS)
    .default([])
    .transform((list) => [...new Set(list)]),
});
export type AnalysisRequest = z.input<typeof analysisRequestSchema>;

/**
 * Formato da resposta do modelo. É usado como structured output na chamada
 * ao Claude, então o próprio schema garante que os nomes pertencem ao catálogo.
 * Restrições de cardinalidade ficam no prompt (structured outputs não aceita
 * minItems/maxItems arbitrários).
 */
export const analysisResultSchema = z.object({
  dinamica: z.enum(names(DINAMICAS)),
  reflexao: z.string(),
  lei: z.enum(names(LEIS)),
  feridas: z.array(z.enum(names(FERIDAS))),
  origem: z.enum(names(ORIGENS)),
  investigacao: z.array(z.object({ tema: z.string(), subtema: z.string(), pergunta: z.string() })),
  categorias: z.array(
    z.object({
      nome: z.string(),
      frases: z.array(
        z.object({ texto: z.string(), especialista: z.string(), contexto: z.string() }),
      ),
    }),
  ),
  exercicios: z.array(
    z.object({
      titulo: z.string(),
      descricao: z.string(),
      intencao: z.string(),
      sensorial: z.boolean(),
    }),
  ),
});
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
