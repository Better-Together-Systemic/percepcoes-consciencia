export interface Ferida {
  nome: string;
  desc: string;
}

export const FERIDAS = [
  {
    nome: 'Rejeição',
    desc: 'Ferida profunda de não ser aceito, de sentir que sua presença é indesejada ou que não há lugar para você no sistema.',
  },
  {
    nome: 'Abandono',
    desc: 'Ferida do ser deixado — física ou emocionalmente. O vínculo foi interrompido antes do tempo, deixando um vazio de pertencimento.',
  },
  {
    nome: 'Humilhação',
    desc: 'Ferida de ter sido envergonhado, diminuído ou exposto. O valor próprio foi atacado por quem deveria proteger.',
  },
  {
    nome: 'Traição',
    desc: 'Ferida de quem confiou e foi traído — por uma palavra, uma ausência, uma mentira. A confiança no outro foi quebrada no sistema.',
  },
  {
    nome: 'Injustiça',
    desc: 'Ferida de sentir que foi tratado de forma desigual, que seus direitos não foram reconhecidos ou que o sistema ignorou sua dor.',
  },
] as const satisfies readonly Ferida[];

export type FeridaNome = (typeof FERIDAS)[number]['nome'];
