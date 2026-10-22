import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { analysisResultSchema } from '@percepcoes/shared';
import { Errors } from '../../lib/errors';
import type { AnalysisGenerator } from './analysis.generator';
import { SYSTEM_PROMPT, buildUserMessage } from './prompt';

interface Options {
  apiKey: string;
  model: string;
}

export function createAnthropicGenerator({ apiKey, model }: Options): AnalysisGenerator {
  const client = new Anthropic({ apiKey, maxRetries: 2, timeout: 120_000 });

  return {
    async generate({ situacao, linguagens }) {
      let response;
      try {
        response = await client.messages.parse({
          model,
          max_tokens: 16000,
          output_config: { effort: 'medium', format: zodOutputFormat(analysisResultSchema) },
          system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
          messages: [{ role: 'user', content: buildUserMessage(situacao, linguagens) }],
        });
      } catch (err) {
        if (err instanceof Anthropic.RateLimitError) {
          throw Errors.unavailable(
            'Serviço de análise sobrecarregado. Tente em instantes.',
            'AI_RATE_LIMITED',
          );
        }
        if (
          err instanceof Anthropic.AuthenticationError ||
          err instanceof Anthropic.PermissionDeniedError
        ) {
          throw Errors.unavailable('Serviço de análise mal configurado.', 'AI_MISCONFIGURED');
        }
        if (err instanceof Anthropic.APIConnectionError) {
          throw Errors.unavailable(
            'Não foi possível contatar o serviço de análise.',
            'AI_UNREACHABLE',
          );
        }
        if (err instanceof Anthropic.APIError) {
          throw Errors.upstream(`Falha no serviço de análise (status ${err.status ?? '?'}).`);
        }
        throw err;
      }

      if (response.stop_reason === 'refusal') {
        throw Errors.badRequest(
          'A análise não pôde ser gerada para este relato. Tente reformular a situação.',
          'AI_REFUSAL',
        );
      }
      if (response.stop_reason === 'max_tokens') {
        throw Errors.upstream(
          'Resposta incompleta. Tente uma descrição mais curta.',
          'AI_TRUNCATED',
        );
      }
      if (!response.parsed_output) {
        throw Errors.upstream(
          'Resposta da análise em formato inesperado. Tente novamente.',
          'AI_INVALID_OUTPUT',
        );
      }
      return response.parsed_output;
    },
  };
}
