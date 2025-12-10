// hooks/useInvalidatingMutation.ts (Enhanced version)
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

interface UseInvalidatingMutationOptions<TData, TVariables> 
  extends Omit<UseMutationOptions<AxiosResponse<TData>, Error, TVariables>, 'mutationFn'> {
  mutationFn: (variables: TVariables) => Promise<AxiosResponse<TData>>;
  invalidateQueries?: string[][]; // Array of query keys to invalidate
  removeQueries?: string[][]; // Array of query keys to completely remove from cache
  refetchQueries?: string[][]; // Array of query keys to force refetch immediately
}

export function useInvalidatingMutation<TData = any, TVariables = any>(
  options: UseInvalidatingMutationOptions<TData, TVariables>
) {
  const queryClient = useQueryClient();
  const { 
    invalidateQueries = [], 
    removeQueries = [],
    refetchQueries = [],
    onSuccess, 
    ...restOptions 
  } = options;

  return useMutation({
    ...restOptions,
    onSuccess: async (data, variables, onMutateResult, context) => {
      // Invalidate queries (marks as stale, refetches if active)
      invalidateQueries.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey });
      });

      // Remove queries (completely removes from cache)
      removeQueries.forEach((queryKey) => {
        queryClient.removeQueries({ queryKey });
      });

      // Force refetch immediately
      for (const queryKey of refetchQueries) {
        await queryClient.refetchQueries({ queryKey });
      }

      // Call the original onSuccess if provided
      onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}