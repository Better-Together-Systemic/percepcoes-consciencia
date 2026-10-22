export interface Origem {
  nome: string;
  desc: string;
  raiz: string;
  sintomas: readonly string[];
}

export const ORIGENS = [
  {
    nome: 'Feridas de Pertencimento',
    raiz: 'Alguém do sistema foi excluído. A dor é lealdade.',
    sintomas: [
      'sensação de não ter lugar',
      'medo de rejeição',
      'autossabotagem',
      'solidão profunda',
    ],
    desc: 'Quando alguém foi excluído, rejeitado, esquecido ou não reconhecido pelo sistema familiar.',
  },
  {
    nome: 'Feridas de Amor Interrompido',
    raiz: 'Vínculo parental fragilizado — pessoal ou transgeracional. O adulto reage com a dor da criança.',
    sintomas: [
      'carência excessiva',
      'dificuldade de confiar',
      'relações instáveis',
      'reatividade emocional',
    ],
    desc: 'Quando o fluxo natural de amor entre pais e filhos foi quebrado antes do tempo.',
  },
  {
    nome: 'Feridas de Culpa e Compensação',
    raiz: 'Compensações inconscientes dentro do sistema familiar.',
    sintomas: [
      'necessidade de se sacrificar',
      'dificuldade de prosperar',
      'medo de ser maior que os pais',
      'autopenalização',
    ],
    desc: 'Quando há desequilíbrio entre dar e receber, gerando ciclos de culpa e expiação no sistema.',
  },
  {
    nome: 'Feridas de Traumas Transgeracionais',
    raiz: 'O que é pesado não é pessoal. É memória que busca resolução.',
    sintomas: [
      'padrões repetitivos',
      'doenças recorrentes',
      'sensação de destino',
      'isso sempre acontece comigo',
    ],
    desc: 'Quando eventos não resolvidos no passado — perdas, violência, exclusões, lutos — atravessam gerações.',
  },
  {
    nome: 'Feridas Existenciais',
    raiz: 'Não é punição. É revelação — memórias profundas emergindo para serem integradas.',
    sintomas: [
      'sensação de deserto interno',
      'angústia sem causa aparente',
      'ruptura interna',
      'vazio existencial',
    ],
    desc: 'Momentos em que memórias profundas do sistema emergem como noites escuras da alma.',
  },
] as const satisfies readonly Origem[];

export type OrigemNome = (typeof ORIGENS)[number]['nome'];
