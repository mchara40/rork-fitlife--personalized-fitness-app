import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExercises, getExerciseById, createExercise, updateExercise, deleteExercise } from '@/api/exercises';
import { useAuth } from '@/contexts/AuthContext';

export function useExercises() {
  return useQuery({
    queryKey: ['exercises'],
    queryFn: getExercises,
  });
}

export function useExercise(id: string) {
  return useQuery({
    queryKey: ['exercise', id],
    queryFn: () => getExerciseById(id),
    enabled: !!id,
  });
}

export function useCreateExercise() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof createExercise>[1]) =>
      createExercise(session, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}

export function useUpdateExercise() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateExercise>[2] }) =>
      updateExercise(session, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      queryClient.invalidateQueries({ queryKey: ['exercise', variables.id] });
    },
  });
}

export function useDeleteExercise() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExercise(session, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}
