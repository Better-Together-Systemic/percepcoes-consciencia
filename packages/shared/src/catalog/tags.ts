export interface AtalhoRapido {
  label: string;
  situacao: string;
}

export const ATALHOS: readonly AtalhoRapido[] = [
  {
    label: 'Medo do pai',
    situacao: 'Filho que cresceu com medo do pai violento e tentava proteger a mãe',
  },
  {
    label: 'Filho no lugar do pai',
    situacao: 'Filho que assumiu o papel de protetor da mãe e ficou no lugar do pai',
  },
  {
    label: 'Bebê não nasceu',
    situacao: 'Bebê que não nasceu, aborto que não foi reconhecido pela família',
  },
  {
    label: 'Irmão morreu',
    situacao: 'Irmão que morreu e não foi suficientemente lembrado ou honrado',
  },
  {
    label: 'Violência transgeracional',
    situacao: 'Violência doméstica com repetição transgeracional',
  },
  { label: 'Movimento interrompido', situacao: 'Bebê separado da mãe logo após o nascimento' },
  { label: 'Hierarquia entre irmãs', situacao: 'Irmã mais nova que não respeita a hierarquia' },
  { label: 'Pai ausente', situacao: 'Pai que foi embora e nunca esteve presente na vida do filho' },
  { label: 'Mãe distante', situacao: 'Mãe que se afastou emocionalmente e nunca demonstrou afeto' },
  {
    label: 'Adoção',
    situacao: 'Criança adotada que carrega o movimento interrompido com a mãe biológica',
  },
  { label: 'Trauma no corpo', situacao: 'Trauma guardado no corpo, sintomas físicos emocionais' },
  {
    label: 'Culpa',
    situacao: 'Pessoa que carrega culpa excessiva que não foi sua responsabilidade',
  },
  { label: 'Exclusão', situacao: 'Pessoa que se sente excluída da família' },
  {
    label: 'Lealdade invisível',
    situacao: 'Filho que repete o mesmo destino dos pais sem perceber',
  },
  { label: 'Separação dos pais', situacao: 'Pais que se separaram e filho ficou no meio' },
  { label: 'Perdão', situacao: 'Pessoa presa no ressentimento que não consegue perdoar' },
];
