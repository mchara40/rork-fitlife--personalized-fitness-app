import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Clock, Zap, CheckCircle, Circle, Play } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useFitness } from '@/contexts/FitnessContext';
import { workoutPrograms } from '@/mocks/programs';
import { getExerciseById } from '@/mocks/exercises';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addExerciseLog } = useFitness();
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  let workout = null;
  let program = null;

  for (const prog of workoutPrograms) {
    const found = prog.workouts.find(w => w.id === id);
    if (found) {
      workout = found;
      program = prog;
      break;
    }
  }

  if (!workout || !program) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Workout not found</Text>
      </View>
    );
  }

  const toggleExerciseComplete = (exerciseId: string) => {
    const newCompleted = new Set(completedExercises);
    if (newCompleted.has(exerciseId)) {
      newCompleted.delete(exerciseId);
    } else {
      newCompleted.add(exerciseId);
    }
    setCompletedExercises(newCompleted);
  };

  const handleExercisePress = (exerciseId: string) => {
    const exercise = getExerciseById(exerciseId);
    if (!exercise) return;

    Alert.alert(
      exercise.name,
      exercise.description,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Exercise', 
          onPress: () => {
            router.push({
              pathname: '/exercise-log',
              params: { 
                exerciseId,
                workoutId: workout.id,
                programId: program.id,
              }
            } as any);
          }
        },
      ]
    );
  };

  const handleCompleteWorkout = () => {
    if (completedExercises.size === 0) {
      Alert.alert('No Exercises Completed', 'Mark at least one exercise as complete');
      return;
    }

    Alert.alert(
      'Complete Workout',
      `You completed ${completedExercises.size} of ${workout.exercises.length} exercises`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Finish',
          onPress: () => {
            completedExercises.forEach(exerciseId => {
              const workoutExercise = workout.exercises.find(e => e.exerciseId === exerciseId);
              if (workoutExercise) {
                addExerciseLog({
                  id: `log_${Date.now()}_${exerciseId}`,
                  exerciseId,
                  workoutId: workout.id,
                  programId: program.id,
                  date: new Date().toISOString(),
                  sets: Array.from({ length: workoutExercise.sets || 3 }, (_, i) => ({
                    setNumber: i + 1,
                    weight: 0,
                    reps: workoutExercise.reps || 0,
                    completed: true,
                  })),
                });
              }
            });
            Alert.alert('Success', 'Workout completed!', [
              { text: 'OK', onPress: () => router.back() }
            ]);
          },
        },
      ]
    );
  };

  const completionPercentage = (completedExercises.size / workout.exercises.length) * 100;

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: workout.name,
          headerStyle: {
            backgroundColor: Colors.backgroundCard,
          },
          headerTintColor: Colors.text,
        }}
      />
      
      <LinearGradient
        colors={[Colors.background, Colors.backgroundLight]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{workout.name}</Text>
          <Text style={styles.description}>{workout.description}</Text>

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Clock size={20} color={Colors.secondary} />
              <Text style={styles.statText}>{workout.duration} min</Text>
            </View>
            <View style={styles.statItem}>
              <Zap size={20} color={Colors.primary} />
              <Text style={styles.statText}>{workout.exercises.length} exercises</Text>
            </View>
          </View>

          {completedExercises.size > 0 && (
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressText}>
                  {completedExercises.size} / {workout.exercises.length} completed
                </Text>
                <Text style={styles.progressPercentage}>
                  {Math.round(completionPercentage)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${completionPercentage}%` }]}>
                  <LinearGradient
                    colors={[Colors.primary, Colors.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          {workout.exercises.map((workoutExercise, index) => {
            const exercise = getExerciseById(workoutExercise.exerciseId);
            if (!exercise) return null;

            const isCompleted = completedExercises.has(exercise.id);

            return (
              <TouchableOpacity
                key={`${exercise.id}-${index}`}
                style={[styles.exerciseCard, isCompleted && styles.exerciseCardCompleted]}
                onPress={() => handleExercisePress(exercise.id)}
              >
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => toggleExerciseComplete(exercise.id)}
                >
                  {isCompleted ? (
                    <CheckCircle size={24} color={Colors.success} fill={Colors.success} />
                  ) : (
                    <Circle size={24} color={Colors.textMuted} />
                  )}
                </TouchableOpacity>

                {exercise.thumbnailUrl && (
                  <Image 
                    source={{ uri: exercise.thumbnailUrl }} 
                    style={styles.exerciseImage}
                  />
                )}

                <View style={styles.exerciseContent}>
                  <Text style={[styles.exerciseName, isCompleted && styles.exerciseNameCompleted]}>
                    {exercise.name}
                  </Text>
                  <View style={styles.exerciseMeta}>
                    {workoutExercise.sets && (
                      <Text style={styles.exerciseMetaText}>
                        {workoutExercise.sets} sets
                      </Text>
                    )}
                    {workoutExercise.reps && (
                      <Text style={styles.exerciseMetaText}>
                        × {workoutExercise.reps} reps
                      </Text>
                    )}
                    {workoutExercise.duration && (
                      <Text style={styles.exerciseMetaText}>
                        {workoutExercise.duration}s
                      </Text>
                    )}
                  </View>
                  {workoutExercise.restTime && (
                    <Text style={styles.restTime}>
                      Rest: {workoutExercise.restTime}s
                    </Text>
                  )}
                </View>

                <TouchableOpacity 
                  style={styles.playIconButton}
                  onPress={() => handleExercisePress(exercise.id)}
                >
                  <Play size={16} color={Colors.secondary} fill={Colors.secondary} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.completeButton}
          onPress={handleCompleteWorkout}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.completeGradient}
          >
            <CheckCircle size={24} color={Colors.white} />
            <Text style={styles.completeButtonText}>Complete Workout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  progressCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.secondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exerciseCardCompleted: {
    borderColor: Colors.success,
    backgroundColor: Colors.backgroundCard,
  },
  checkbox: {
    marginRight: 12,
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  exerciseNameCompleted: {
    color: Colors.success,
  },
  exerciseMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  exerciseMetaText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  restTime: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  playIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  completeButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  completeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 18,
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  errorText: {
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    marginTop: 100,
  },
});
