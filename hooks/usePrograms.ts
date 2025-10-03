import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPrograms, getProgramById, createProgram, updateProgram, deleteProgram } from '@/api/programs';
import { useAuth } from '@/contexts/AuthContext';

export function usePrograms(gender?: 'male' | 'female' | 'all') {
  return useQuery({
    queryKey: ['programs', gender],
    queryFn: () => getPrograms(gender),
  });
}

export function useProgram(id: string) {
  return useQuery({
    queryKey: ['program', id],
    queryFn: () => getProgramById(id),
    enabled: !!id,
  });
}

export function useCreateProgram() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof createProgram>[1]) => 
      createProgram(session, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
}

export function useUpdateProgram() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateProgram>[2] }) =>
      updateProgram(session, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['program', variables.id] });
    },
  });
}

export function useDeleteProgram() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProgram(session, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
}
