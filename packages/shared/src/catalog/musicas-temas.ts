import type { DinamicaNome } from './dinamicas';
import type { FeridaNome } from './feridas';
import type { MusicaInternacionalId, MusicaNacionalId } from './musicas';

/**
 * Chaves curtas das dinâmicas e feridas, para manter a tabela abaixo legível.
 * O `satisfies` garante que cada valor é um nome existente no catálogo.
 */
export const DINAMICA_POR_CHAVE = {
  vinculo: 'Vínculo de amor interrompido',
  lealdade: 'Lealdade invisível',
  exclusao: 'Exclusão de membros do sistema',
  compensacao: 'Compensações inconscientes',
  repeticao: 'Repetição de destinos traumáticos',
  transgeracional: 'Memórias transgeracionais ativadas',
  sintoma: 'Sintoma como mensageiro sistêmico',
  hierarquia: 'Desordens hierárquicas',
  interrupcao: 'Interrupção do movimento amoroso',
  identificacao: 'Identificações inconscientes com antepassados',
} as const satisfies Record<string, DinamicaNome>;

export const FERIDA_POR_CHAVE = {
  rejeicao: 'Rejeição',
  abandono: 'Abandono',
  humilhacao: 'Humilhação',
  traicao: 'Traição',
  injustica: 'Injustiça',
} as const satisfies Record<string, FeridaNome>;

export type ChaveDinamica = keyof typeof DINAMICA_POR_CHAVE;
export type ChaveFerida = keyof typeof FERIDA_POR_CHAVE;

export interface TemasMusica {
  /** Dinâmicas com que a música ressoa, da mais forte para a mais fraca. */
  d: readonly ChaveDinamica[];
  /** Feridas que a música toca (pode ser vazio). */
  f: readonly ChaveFerida[];
}

/**
 * Temas de cada música, usados para escolhê-las localmente a partir da
 * dinâmica e das feridas identificadas pela IA (ver selecionarMusicas).
 * Ao adicionar uma música ao catálogo, o typecheck exige incluí-la aqui.
 */
export const TEMAS_NACIONAIS: Record<MusicaNacionalId, TemasMusica> = {
  vinculo: { d: ['vinculo', 'interrupcao'], f: ['abandono'] },
  lealdade: { d: ['lealdade', 'exclusao'], f: ['injustica'] },
  exclusao: { d: ['exclusao', 'lealdade'], f: ['humilhacao', 'injustica'] },
  compensacao: { d: ['compensacao', 'interrupcao'], f: [] },
  repeticao: { d: ['repeticao', 'transgeracional'], f: [] },
  transgeracional: { d: ['transgeracional', 'identificacao'], f: [] },
  sintoma: { d: ['sintoma'], f: [] },
  hierarquia: { d: ['hierarquia', 'vinculo'], f: ['abandono'] },
  interrupcao: { d: ['interrupcao', 'repeticao', 'lealdade'], f: [] },
  identificacao: { d: ['identificacao', 'transgeracional'], f: [] },
  pertencimento: { d: ['exclusao', 'vinculo'], f: ['abandono'] },
  amor_interrompido: { d: ['vinculo', 'interrupcao'], f: ['abandono'] },
  culpa: { d: ['compensacao'], f: ['humilhacao'] },
  trauma: { d: ['repeticao', 'sintoma'], f: ['traicao', 'abandono'] },
  existencial: { d: ['vinculo'], f: [] },
  abandono: { d: ['exclusao'], f: ['abandono', 'injustica'] },
  rejeicao: { d: ['exclusao'], f: ['rejeicao', 'humilhacao'] },
  injustica: { d: ['compensacao'], f: ['injustica', 'humilhacao'] },
  traicao: { d: ['interrupcao'], f: ['traicao', 'rejeicao'] },
  reparacao: { d: ['interrupcao', 'compensacao'], f: [] },
  romaria: { d: ['sintoma', 'compensacao'], f: ['injustica'] },
  trem_bala: { d: ['interrupcao', 'vinculo'], f: [] },
  pais_filhos: { d: ['hierarquia', 'vinculo'], f: ['abandono'] },
  maria_maria: { d: ['transgeracional', 'lealdade'], f: ['injustica'] },
  cancao_america: { d: ['vinculo', 'interrupcao'], f: ['abandono'] },
  coracao_est: { d: ['lealdade', 'repeticao'], f: ['injustica'] },
  oracao_banda: { d: ['interrupcao', 'sintoma'], f: [] },
  velha_infancia: { d: ['vinculo'], f: [] },
  guerreiro_menino: { d: ['hierarquia', 'sintoma'], f: ['humilhacao'] },
  espatodea: { d: ['vinculo', 'identificacao'], f: [] },
  o_sol: { d: ['interrupcao', 'vinculo'], f: [] },
  anunciacao: { d: ['transgeracional', 'interrupcao'], f: [] },
  asa_branca: { d: ['exclusao', 'transgeracional'], f: ['abandono'] },
  amor_i_love: { d: ['interrupcao'], f: [] },
  vilarejo: { d: ['exclusao'], f: ['rejeicao'] },
  segundo_sol: { d: ['repeticao', 'transgeracional'], f: [] },
  por_enquanto: { d: ['interrupcao', 'vinculo'], f: ['abandono'] },
  monte_castelo: { d: ['interrupcao', 'compensacao'], f: [] },
  tempo_perdido: { d: ['repeticao', 'identificacao'], f: [] },
  meu_abrigo: { d: ['vinculo'], f: [] },
  dois_rios: { d: ['hierarquia', 'interrupcao'], f: ['abandono'] },
  epitafio: { d: ['compensacao', 'sintoma'], f: [] },
  tempo_nao_para: { d: ['repeticao'], f: ['injustica', 'traicao'] },
  amor_recomecar: { d: ['interrupcao', 'compensacao'], f: ['traicao'] },
  metamorfose: { d: ['lealdade', 'identificacao'], f: [] },
  construcao: { d: ['sintoma', 'exclusao'], f: ['injustica', 'humilhacao'] },
  calice: { d: ['sintoma', 'exclusao'], f: ['injustica'] },
  aguas_marco: { d: ['transgeracional', 'repeticao'], f: [] },
  oracao_tempo: { d: ['transgeracional', 'compensacao'], f: [] },
  oceano: { d: ['vinculo'], f: ['abandono'] },
  planeta_agua: { d: ['transgeracional', 'interrupcao'], f: [] },
  sou_ze_silva: { d: ['exclusao', 'lealdade'], f: ['humilhacao'] },
};

export const TEMAS_INTERNACIONAIS: Record<MusicaInternacionalId, TemasMusica> = {
  imagine: { d: ['exclusao'], f: ['injustica'] },
  let_it_be: { d: ['compensacao', 'sintoma'], f: [] },
  hey_jude: { d: ['hierarquia', 'interrupcao'], f: [] },
  yesterday: { d: ['repeticao', 'vinculo'], f: ['abandono'] },
  hallelujah: { d: ['compensacao', 'interrupcao'], f: ['traicao'] },
  fix_you: { d: ['sintoma', 'vinculo'], f: [] },
  the_scientist: { d: ['interrupcao', 'repeticao'], f: ['traicao'] },
  viva_la_vida: { d: ['exclusao', 'compensacao'], f: ['humilhacao'] },
  someone_you: { d: ['interrupcao'], f: ['abandono', 'rejeicao'] },
  hello_adele: { d: ['interrupcao', 'compensacao'], f: [] },
  easy_on_me: { d: ['hierarquia', 'compensacao'], f: [] },
  all_of_me: { d: ['interrupcao'], f: [] },
  stay_with_me: { d: ['vinculo'], f: ['abandono'] },
  shallow: { d: ['repeticao', 'sintoma'], f: [] },
  my_heart: { d: ['vinculo', 'identificacao'], f: ['abandono'] },
  i_will_always: { d: ['interrupcao'], f: [] },
  heal_world: { d: ['transgeracional', 'exclusao'], f: [] },
  man_mirror: { d: ['compensacao', 'repeticao'], f: [] },
  perfect: { d: ['interrupcao'], f: [] },
  photograph: { d: ['vinculo'], f: [] },
  thinking_loud: { d: ['interrupcao', 'transgeracional'], f: [] },
  let_her_go: { d: ['interrupcao'], f: ['abandono'] },
  human: { d: ['compensacao', 'hierarquia'], f: ['humilhacao'] },
  take_me_church: { d: ['exclusao'], f: ['humilhacao', 'rejeicao'] },
  say_something: { d: ['interrupcao'], f: ['rejeicao', 'abandono'] },
  chasing_cars: { d: ['vinculo'], f: [] },
  rise_up: { d: ['repeticao', 'sintoma'], f: [] },
  stand_by_me: { d: ['vinculo', 'exclusao'], f: [] },
  lean_on_me: { d: ['compensacao', 'exclusao'], f: [] },
  bridge_troubled: { d: ['vinculo', 'compensacao'], f: [] },
  sound_silence: { d: ['sintoma', 'exclusao'], f: ['rejeicao'] },
  no_woman_cry: { d: ['transgeracional', 'sintoma'], f: ['injustica'] },
  redemption_song: { d: ['transgeracional', 'lealdade'], f: ['injustica', 'humilhacao'] },
  counting_stars: { d: ['lealdade', 'compensacao'], f: [] },
  hero_mariah: { d: ['identificacao', 'sintoma'], f: [] },
  if_i_aint: { d: ['interrupcao'], f: [] },
  no_one: { d: ['vinculo'], f: [] },
  beautiful: { d: ['exclusao'], f: ['rejeicao', 'humilhacao'] },
  see_you_again: { d: ['exclusao', 'vinculo'], f: ['abandono'] },
  memories: { d: ['exclusao', 'transgeracional'], f: [] },
  unchained: { d: ['vinculo'], f: ['abandono'] },
  angels: { d: ['identificacao', 'vinculo'], f: [] },
  someone_loved: { d: ['interrupcao'], f: ['abandono', 'rejeicao'] },
  arcade: { d: ['repeticao'], f: ['rejeicao'] },
  thousand_years: { d: ['vinculo', 'interrupcao'], f: [] },
  you_raise_me: { d: ['hierarquia', 'vinculo'], f: [] },
  everybody_hurts: { d: ['sintoma', 'identificacao'], f: [] },
  mad_world: { d: ['repeticao', 'sintoma'], f: ['rejeicao'] },
  goodness_god: { d: ['compensacao', 'transgeracional'], f: [] },
  my_way: { d: ['lealdade', 'hierarquia'], f: [] },
};
