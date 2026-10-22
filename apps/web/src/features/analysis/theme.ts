import type { FeridaNome, LinguagemId, OrigemNome } from '@percepcoes/shared';
import type { PanelTheme } from '../../shared/ui';

const panel = (accent: string, from: string, to: string): PanelTheme => ({
  accent,
  background: `linear-gradient(135deg, ${from}, ${to})`,
  labelBackground: from,
});

/** Tema visual de cada bloco de resultado. Dados de domínio ficam em @percepcoes/shared. */
export const PANEL_THEMES = {
  dinamica: panel('#8fa8c8', '#0d1a1f', '#0a1518'),
  reflexao: panel('rgba(201,169,110,0.55)', '#1a1a2a', '#141420'),
  lei: panel('#a8c8a0', '#0f1a12', '#0c1510'),
  feridasMultiplas: panel('#c8a0c8', '#1a0f1a', '#110b11'),
  investigacao: panel('#b8a8d8', '#0f0d1a', '#0c0a14'),
  linguagens: panel('#c9a96e', '#12100a', '#0d0c08'),
  exercicios: panel('#a8c8a0', '#0e1a10', '#0b1510'),
  musicas: panel('#9b8fc8', '#130f1e', '#0e0b18'),
} satisfies Record<string, PanelTheme>;

export const FERIDA_THEMES: Record<FeridaNome, PanelTheme> = {
  Rejeição: panel('#c8a0c8', '#1a0d1f', '#150a1a'),
  Abandono: panel('#8fb4c8', '#0d1520', '#0a1018'),
  Humilhação: panel('#c8b87a', '#1a1608', '#141205'),
  Traição: panel('#c89080', '#1f0e0a', '#180a08'),
  Injustiça: panel('#90c8a8', '#0a1a10', '#08140d'),
};

export const ORIGEM_THEMES: Record<OrigemNome, PanelTheme> = {
  'Feridas de Pertencimento': panel('#a8b8d8', '#0d1220', '#090e18'),
  'Feridas de Amor Interrompido': panel('#c9a96e', '#1a1408', '#130f05'),
  'Feridas de Culpa e Compensação': panel('#c8a0c8', '#180d18', '#120910'),
  'Feridas de Traumas Transgeracionais': panel('#c89878', '#1a1008', '#140c05'),
  'Feridas Existenciais': panel('#9898c8', '#0f0d1a', '#0a0912'),
};

export const LINGUAGEM_COLORS: Record<LinguagemId, string> = {
  palavras: '#c9a96e',
  atencao: '#8fb4c8',
  toque: '#c8a0c8',
  servico: '#a8c8a0',
  presentes: '#c89878',
};
