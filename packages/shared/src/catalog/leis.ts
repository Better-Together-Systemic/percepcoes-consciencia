export interface Lei {
  nome: string;
  desc: string;
}

export const LEIS = [
  {
    nome: 'Pertencimento',
    desc: 'Todos têm direito a pertencer. Quando alguém é excluído surge uma dinâmica de repetição ou identificação.',
  },
  {
    nome: 'Ordem (Hierarquia)',
    desc: 'Quem veio antes tem precedência. Quando um filho assume lugar de pai surge uma dinâmica de inversão.',
  },
  {
    nome: 'Equilíbrio (Dar e Receber)',
    desc: 'Principalmente entre adultos. Quando há desequilíbrio surgem culpas, compensações, rupturas.',
  },
] as const satisfies readonly Lei[];

export type LeiNome = (typeof LEIS)[number]['nome'];
