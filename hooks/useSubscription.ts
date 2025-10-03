import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserSubscription, startFreeTrial, createSubscription, cancelSubscription } from '@/api/subscriptions';
import { useAuth } from '@/contexts/AuthContext';

export function useSubscription() {
  const { session } = useAuth();

  return useQuery({
    queryKey: ['subscription', session?.userId, session],
    queryFn: () => getUserSubscription(session),
    enabled: !!session,
  });
}

export function useStartFreeTrial() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cardData: Parameters<typeof startFreeTrial>[1]) =>
      startFreeTrial(session, cardData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
}

export function useCreateSubscription() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Parameters<typeof createSubscription>[1]) =>
      createSubscription(session, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
}

export function useCancelSubscription() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: string) => cancelSubscription(session, subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
}
