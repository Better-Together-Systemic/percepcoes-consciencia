import {
  DINAMICA_POR_CHAVE,
  DINAMICAS,
  TEMAS_INTERNACIONAIS,
  TEMAS_NACIONAIS,
  selecionarMusicas,
} from '@percepcoes/shared';
import { describe, expect, it } from 'vitest';

const chaveDe = (nome: string) =>
  Object.entries(DINAMICA_POR_CHAVE).find(([, n]) => n === nome)?.[0];

describe('selecionarMusicas', () => {
  it('toda dinâmica do catálogo tem música nacional e internacional', () => {
    for (const { nome } of DINAMICAS) {
      const chave = chaveDe(nome);
      expect(chave, nome).toBeDefined();
      for (const temas of [TEMAS_NACIONAIS, TEMAS_INTERNACIONAIS]) {
        expect(
          Object.values(temas).some((t) => (t.d as string[]).includes(chave!)),
          nome,
        ).toBe(true);
      }
    }
  });

  it('escolhe músicas que ressoam com a dinâmica identificada', () => {
    for (const { nome } of DINAMICAS) {
      const { nacional, internacional } = selecionarMusicas({
        dinamica: nome,
        feridas: [],
        reflexao: 'x',
      });
      const chave = chaveDe(nome)!;
      const nac = TEMAS_NACIONAIS[nacional.musica.id as keyof typeof TEMAS_NACIONAIS];
      const int =
        TEMAS_INTERNACIONAIS[internacional.musica.id as keyof typeof TEMAS_INTERNACIONAIS];
      expect(nac.d as string[]).toContain(chave);
      expect(int.d as string[]).toContain(chave);
      expect(nacional.motivo).toContain(nome);
    }
  });

  it('usa as feridas para desempatar', () => {
    const { nacional } = selecionarMusicas({
      dinamica: 'Exclusão de membros do sistema',
      feridas: ['Rejeição', 'Humilhação'],
      reflexao: 'x',
    });
    expect(nacional.musica.id).toBe('rejeicao');
    expect(nacional.motivo).toContain('as feridas de rejeição e humilhação');
  });

  it('é determinística para a mesma análise', () => {
    const criterios = {
      dinamica: 'Vínculo de amor interrompido',
      feridas: ['Abandono'],
      reflexao: 'Uma reflexão qualquer.',
    } as const;
    expect(selecionarMusicas(criterios)).toEqual(selecionarMusicas(criterios));
  });
});
