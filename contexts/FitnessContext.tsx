import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { ExerciseLog, UserProfile, UserProgress, Subscription } from '@/types/fitness';

const STORAGE_KEYS = {
  EXERCISE_LOGS: '@fitness_exercise_logs',
  USER_PROFILE: '@fitness_user_profile',
  CURRENT_WORKOUT: '@fitness_current_workout',
};

export const [FitnessContext, useFitness] = createContextHook(() => {
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [logsData, profileData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.EXERCISE_LOGS),
        AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE),
      ]);

      if (logsData) {
        setExerciseLogs(JSON.parse(logsData));
      }

      if (profileData) {
        setUserProfile(JSON.parse(profileData));
      } else {
        const defaultProfile: UserProfile = {
          id: 'user1',
          name: 'Fitness User',
          email: 'user@example.com',
          gender: 'all',
          subscription: {
            plan: '1_month',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            isActive: true,
            isTrial: true,
            autoRenew: false,
          },
          trialUsed: false,
          paymentCards: [],
        };
        setUserProfile(defaultProfile);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(defaultProfile));
      }
    } catch (error) {
      console.error('Error loading fitness data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addExerciseLog = useCallback(async (log: ExerciseLog) => {
    try {
      const updatedLogs = [...exerciseLogs, log];
      setExerciseLogs(updatedLogs);
      await AsyncStorage.setItem(STORAGE_KEYS.EXERCISE_LOGS, JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Error adding exercise log:', error);
    }
  }, [exerciseLogs]);

  const updateExerciseLog = useCallback(async (logId: string, updates: Partial<ExerciseLog>) => {
    try {
      const updatedLogs = exerciseLogs.map(log =>
        log.id === logId ? { ...log, ...updates } : log
      );
      setExerciseLogs(updatedLogs);
      await AsyncStorage.setItem(STORAGE_KEYS.EXERCISE_LOGS, JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Error updating exercise log:', error);
    }
  }, [exerciseLogs]);

  const updateSubscription = useCallback(async (subscription: Subscription) => {
    if (!userProfile) return;
    
    try {
      const updatedProfile = { ...userProfile, subscription };
      setUserProfile(updatedProfile);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  }, [userProfile]);

  const hasActiveSubscription = useMemo(() => {
    if (!userProfile?.subscription) return false;
    const now = new Date();
    const endDate = new Date(userProfile.subscription.endDate);
    return userProfile.subscription.isActive && endDate > now;
  }, [userProfile]);

  const getUserProgress = useMemo((): UserProgress => {
    const workoutDates = new Map<string, number>();
    
    exerciseLogs.forEach(log => {
      const date = log.date.split('T')[0];
      workoutDates.set(date, (workoutDates.get(date) || 0) + 1);
    });

    const sortedDates = Array.from(workoutDates.keys()).sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const date = new Date(sortedDates[i]);
      date.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (i === sortedDates.length - 1 && daysDiff <= 1) {
        currentStreak = 1;
        tempStreak = 1;
      } else if (i < sortedDates.length - 1) {
        const prevDate = new Date(sortedDates[i + 1]);
        prevDate.setHours(0, 0, 0, 0);
        const diff = Math.floor((prevDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diff === 1) {
          tempStreak++;
          if (i === sortedDates.length - 1 || currentStreak > 0) {
            currentStreak = tempStreak;
          }
        } else {
          tempStreak = 1;
        }
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    const personalRecords = exerciseLogs.reduce((records, log) => {
      log.sets.forEach(set => {
        if (!set.completed) return;
        
        const existingRecord = records.find(r => r.exerciseId === log.exerciseId);
        
        if (set.weight) {
          if (!existingRecord || (existingRecord.type === 'weight' && set.weight > existingRecord.value)) {
            const index = records.findIndex(r => r.exerciseId === log.exerciseId);
            const newRecord = {
              exerciseId: log.exerciseId,
              exerciseName: log.exerciseId,
              type: 'weight' as const,
              value: set.weight,
              date: log.date,
            };
            if (index >= 0) {
              records[index] = newRecord;
            } else {
              records.push(newRecord);
            }
          }
        }
      });
      return records;
    }, [] as UserProgress['personalRecords']);

    const weeklyStats = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      
      const weekLogs = exerciseLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= weekStart && logDate < weekEnd;
      });
      
      const workoutIds = new Set(weekLogs.map(log => log.workoutId));
      
      weeklyStats.unshift({
        week: `Week ${12 - i}`,
        workouts: workoutIds.size,
        exercises: weekLogs.length,
      });
    }

    return {
      totalWorkouts: new Set(exerciseLogs.map(log => log.workoutId)).size,
      totalExercises: exerciseLogs.length,
      currentStreak,
      longestStreak,
      personalRecords,
      weeklyStats,
    };
  }, [exerciseLogs]);

  return useMemo(() => ({
    exerciseLogs,
    userProfile,
    isLoading,
    hasActiveSubscription,
    userProgress: getUserProgress,
    addExerciseLog,
    updateExerciseLog,
    updateSubscription,
  }), [exerciseLogs, userProfile, isLoading, hasActiveSubscription, getUserProgress, addExerciseLog, updateExerciseLog, updateSubscription]);
});

export function useExerciseHistory(exerciseId: string) {
  const { exerciseLogs } = useFitness();
  
  return useMemo(() => {
    return exerciseLogs
      .filter(log => log.exerciseId === exerciseId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [exerciseLogs, exerciseId]);
}
