import {
  DINAMICA_POR_CHAVE,
  FERIDA_POR_CHAVE,
  MUSICAS_INTERNACIONAIS,
  MUSICAS_NACIONAIS,
  TEMAS_INTERNACIONAIS,
  TEMAS_NACIONAIS,
  type Musica,
  type TemasMusica,
} from './catalog';
import type { AnalysisResult } from './schemas';

export interface MusicaEscolhida {
  musica: Musica;
  motivo: string;
}

export interface MusicasEscolhidas {
  nacional: MusicaEscolhida;
  internacional: MusicaEscolhida;
}

interface Criterios {
  dinamica: AnalysisResult['dinamica'];
  feridas: readonly AnalysisResult['feridas'][number][];
  reflexao: string;
}

// Pesos: a dinâmica é o critério principal; feridas desempatam entre as que
// ressoam com a mesma dinâmica.
const PESO_DINAMICA_PRINCIPAL = 4;
const PESO_DINAMICA_SECUNDARIA = 2;
const PESO_FERIDA = 1;

/** Hash FNV-1a: estável entre renders e entre servidor/cliente. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function pontuar(temas: TemasMusica, { dinamica, feridas }: Criterios): number {
  let pontos = 0;
  temas.d.forEach((chave, i) => {
    if (DINAMICA_POR_CHAVE[chave] === dinamica) {
      pontos += i === 0 ? PESO_DINAMICA_PRINCIPAL : PESO_DINAMICA_SECUNDARIA;
    }
  });
  for (const chave of temas.f) {
    if ((feridas as readonly string[]).includes(FERIDA_POR_CHAVE[chave])) pontos += PESO_FERIDA;
  }
  return pontos;
}

function motivo(temas: TemasMusica, { dinamica, feridas }: Criterios): string {
  const tocaDinamica = temas.d.some((c) => DINAMICA_POR_CHAVE[c] === dinamica);
  const feridasTocadas = temas.f
    .map((c) => FERIDA_POR_CHAVE[c])
    .filter((f) => (feridas as readonly string[]).includes(f));
  const lista = feridasTocadas.join(' e ').toLowerCase();
  const ferida =
    feridasTocadas.length > 1 ? `as feridas de ${lista}` : lista ? `a ferida de ${lista}` : '';
  if (tocaDinamica && ferida) return `Ressoa com a dinâmica “${dinamica}” e com ${ferida}.`;
  if (tocaDinamica) return `Ressoa com a dinâmica “${dinamica}”.`;
  if (ferida) return `Toca ${ferida}.`;
  return 'Um convite a sentir o que está presente no campo.';
}

function escolher<Id extends string>(
  musicas: readonly (Musica & { id: Id })[],
  temas: Record<Id, TemasMusica>,
  criterios: Criterios,
  semente: number,
): MusicaEscolhida {
  const pontuadas = musicas.map((musica) => ({
    musica,
    pontos: pontuar(temas[musica.id], criterios),
  }));
  const melhor = Math.max(...pontuadas.map((p) => p.pontos));
  const empatadas = pontuadas.filter((p) => p.pontos === melhor);
  // Entre as empatadas, a semente varia a escolha entre análises diferentes
  // mas mantém a mesma música para a mesma análise.
  const { musica } = empatadas[semente % empatadas.length]!;
  return { musica, motivo: motivo(temas[musica.id], criterios) };
}

/**
 * Escolhe localmente 1 música nacional e 1 internacional a partir da dinâmica e
 * das feridas identificadas pela IA, sem enviar o catálogo ao modelo.
 */
export function selecionarMusicas(criterios: Criterios): MusicasEscolhidas {
  const semente = hash(criterios.reflexao);
  return {
    nacional: escolher(MUSICAS_NACIONAIS, TEMAS_NACIONAIS, criterios, semente),
    internacional: escolher(MUSICAS_INTERNACIONAIS, TEMAS_INTERNACIONAIS, criterios, semente >>> 8),
  };
}
