export interface LinguagemAmor {
  id: string;
  opcao: string;
  nome: string;
  frases: readonly string[];
  raizes: readonly string[];
  fraseChave: string;
}

export const LINGUAGENS = [
  {
    id: 'palavras',
    opcao: 'Eu preciso de palavras.',
    nome: 'Palavras de Afirmação',
    frases: ['Eu preciso que diga que me ama.', 'Preciso ouvir que sou importante.'],
    raizes: [
      'amor não verbalizado na infância',
      'pai ou mãe emocionalmente distantes',
      'vínculo de amor interrompido',
    ],
    fraseChave: 'A criança não ouviu. O adulto exige.',
  },
  {
    id: 'atencao',
    opcao: 'Eu preciso de atenção.',
    nome: 'Tempo de Qualidade',
    frases: ['Eu preciso que esteja comigo.', 'Preciso que me priorize.'],
    raizes: [
      'ausência física ou emocional dos pais',
      'abandono real ou simbólico',
      'exclusão afetiva',
    ],
    fraseChave: 'Aqui pode tocar pertencimento.',
  },
  {
    id: 'toque',
    opcao: 'Eu preciso que me toque.',
    nome: 'Toque Físico',
    frases: ['Eu preciso de abraço.', 'Preciso de proximidade.'],
    raizes: [
      'carência de contato precoce',
      'hospitalização ou separações precoces',
      'mãe deprimida ou distante',
    ],
    fraseChave: 'Amor interrompido no corpo.',
  },
  {
    id: 'servico',
    opcao: 'Eu preciso que faça por mim.',
    nome: 'Atos de Serviço',
    frases: ['Preciso que faça por mim.', 'Preciso que me ajude.'],
    raizes: [
      'criança que precisou ser adulta cedo',
      'inversão de papéis familiares',
      'falta de suporte parental',
    ],
    fraseChave: 'Eu tive que dar conta sozinho.',
  },
  {
    id: 'presentes',
    opcao: 'Eu preciso ganhar presentes.',
    nome: 'Presentes',
    frases: ['Eu preciso ganhar algo.', 'Preciso receber algo concreto.'],
    raizes: [
      'culpa parental compensada com objetos',
      'amor material substituindo presença',
      'ausência emocional mascarada por coisas',
    ],
    fraseChave: 'A pessoa aprendeu que amor = objeto.',
  },
] as const satisfies readonly LinguagemAmor[];

export type LinguagemId = (typeof LINGUAGENS)[number]['id'];

export const MAX_LINGUAGENS = 3;
