import type { FastifyPluginAsync } from 'fastify';
import { analysisRequestSchema } from '@percepcoes/shared';
import { Errors } from '../../lib/errors';
import type { AnalysisGenerator } from './analysis.generator';

export const analysisRoutes =
  (generator: AnalysisGenerator | null): FastifyPluginAsync =>
  async (app) => {
    app.post(
      '/',
      {
        preHandler: app.authenticate,
        // Cada análise tem custo: limita por IP para conter abuso.
        config: { rateLimit: { max: 20, timeWindow: '1 hour' } },
      },
      async (request) => {
        if (!generator) {
          throw Errors.unavailable(
            'Análise indisponível: ANTHROPIC_API_KEY não configurada.',
            'AI_DISABLED',
          );
        }
        const input = analysisRequestSchema.parse(request.body);
        const startedAt = Date.now();
        const result = await generator.generate(input);
        // O relato é dado sensível: só metadados vão para o log, nunca o conteúdo.
        request.log.info(
          {
            userId: request.currentUser.id,
            chars: input.situacao.length,
            ms: Date.now() - startedAt,
          },
          'analysis generated',
        );
        return { result };
      },
    );
  };
