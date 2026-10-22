import type { AnalysisRequest, AnalysisResult } from '@percepcoes/shared';
import { useMutation } from '@tanstack/react-query';
import { http } from '../../shared/api/http';

export function useAnalyze() {
  return useMutation({
    mutationFn: async (body: AnalysisRequest) =>
      (await http.post<{ result: AnalysisResult }>('/analysis', body)).result,
  });
}
