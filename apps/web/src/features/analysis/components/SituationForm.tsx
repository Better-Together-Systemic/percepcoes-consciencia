import { SITUACAO_MAX_LENGTH, type LinguagemId } from '@percepcoes/shared';
import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Button, Card, Spinner } from '../../../shared/ui';
import { LoveLanguagePicker } from './LoveLanguagePicker';
import { QuickTags } from './QuickTags';
import styles from './SituationForm.module.css';

interface Props {
  busy: boolean;
  onSubmit: (situacao: string, linguagens: LinguagemId[]) => void;
}

export function SituationForm({ busy, onSubmit }: Props) {
  const [situacao, setSituacao] = useState('');
  const [linguagens, setLinguagens] = useState<LinguagemId[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  const canSubmit = !busy && situacao.trim().length > 0;

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (canSubmit) onSubmit(situacao.trim(), linguagens);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submit(e);
  };

  return (
    <Card title="Descreva a situação em detalhes" className={styles.card}>
      <form onSubmit={submit}>
        <label htmlFor={id} className="visually-hidden">
          Situação
        </label>
        <textarea
          id={id}
          ref={textareaRef}
          className={styles.textarea}
          placeholder="Descreva livremente: a dinâmica familiar, os padrões, os vínculos, as emoções..."
          maxLength={SITUACAO_MAX_LENGTH}
          value={situacao}
          onChange={(e) => setSituacao(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <QuickTags
          onPick={(text) => {
            setSituacao(text);
            textareaRef.current?.focus();
          }}
        />
        <LoveLanguagePicker value={linguagens} onChange={setLinguagens} />
        <Button type="submit" size="lg" block disabled={!canSubmit} className={styles.submit}>
          {busy ? (
            <>
              <Spinner /> Analisando...
            </>
          ) : (
            'Analisar e Gerar Percepções'
          )}
        </Button>
      </form>
    </Card>
  );
}
