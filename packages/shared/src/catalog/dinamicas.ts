export interface Dinamica {
  nome: string;
  desc: string;
}

export const DINAMICAS = [
  {
    nome: 'Vínculo de amor interrompido',
    desc: 'Quando o amor na primeira infância foi insuficiente ou houve ruptura. Pode ser pessoal ou transgeracional.',
  },
  {
    nome: 'Lealdade invisível',
    desc: 'Antes de sermos felizes, somos leais. Repetimos destinos por amor inconsciente.',
  },
  {
    nome: 'Exclusão de membros do sistema',
    desc: 'Quando alguém foi esquecido, julgado ou retirado do pertencimento.',
  },
  {
    nome: 'Compensações inconscientes',
    desc: 'Movimentos de culpa, expiação ou tentativa de equilibrar destinos difíceis.',
  },
  {
    nome: 'Repetição de destinos traumáticos',
    desc: 'Memórias epigenéticas que buscam resolução através dos descendentes.',
  },
  {
    nome: 'Memórias transgeracionais ativadas',
    desc: 'Quando sofrimentos antigos emergem de forma desproporcional ao fato atual.',
  },
  {
    nome: 'Sintoma como mensageiro sistêmico',
    desc: 'O corpo fala aquilo que o sistema silenciou.',
  },
  { nome: 'Desordens hierárquicas', desc: 'Quando filhos assumem lugares que não lhes pertencem.' },
  { nome: 'Interrupção do movimento amoroso', desc: 'Bloqueio no fluxo do dar e receber.' },
  {
    nome: 'Identificações inconscientes com antepassados',
    desc: '"Eu por você." Carregar o que não começou em mim.',
  },
] as const satisfies readonly Dinamica[];

export type DinamicaNome = (typeof DINAMICAS)[number]['nome'];
