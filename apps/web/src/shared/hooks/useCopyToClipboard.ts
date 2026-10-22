import { useCallback, useEffect, useRef, useState } from 'react';

/** Copia texto e expõe qual chave foi copiada por último (some após `resetMs`). */
export function useCopyToClipboard(resetMs = 1500) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string, key: string) => {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopiedKey(null), resetMs);
    },
    [resetMs],
  );

  return { copy, copiedKey };
}
