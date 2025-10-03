import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserExerciseLogs, getExerciseHistory, createExerciseLog, updateExerciseLog, deleteExerciseLog } from '@/api/exercise-logs';
import { useAuth } from '@/contexts/AuthContext';

export function useExerciseLogs() {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['exercise-logs', session?.userId, session],
    queryFn: () => getUserExerciseLogs(session),
    enabled: !!session,
  });
}

export function useExerciseHistory(exerciseId: string) {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['exercise-history', exerciseId, session?.userId, session],
    queryFn: () => getExerciseHistory(session, exerciseId),
    enabled: !!session && !!exerciseId,
  });
}

export function useCreateExerciseLog() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof createExerciseLog>[1]) =>
      createExerciseLog(session, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-logs'] });
      queryClient.invalidateQueries({ queryKey: ['exercise-history'] });
    },
  });
}

export function useUpdateExerciseLog() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ logId, data }: { logId: string; data: Parameters<typeof updateExerciseLog>[2] }) =>
      updateExerciseLog(session, logId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-logs'] });
      queryClient.invalidateQueries({ queryKey: ['exercise-history'] });
    },
  });
}

export function useDeleteExerciseLog() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (logId: string) => deleteExerciseLog(session, logId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-logs'] });
      queryClient.invalidateQueries({ queryKey: ['exercise-history'] });
    },
  });
}
