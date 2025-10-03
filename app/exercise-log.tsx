import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Plus, Minus, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useFitness } from '@/contexts/FitnessContext';
import { getExerciseById } from '@/mocks/exercises';
import { SetLog } from '@/types/fitness';

export default function ExerciseLogScreen() {
  const { exerciseId, workoutId, programId } = useLocalSearchParams<{ 
    exerciseId: string; 
    workoutId: string;
    programId: string;
  }>();
  const router = useRouter();
  const { addExerciseLog } = useFitness();

  const exercise = getExerciseById(exerciseId);

  const [sets, setSets] = useState<SetLog[]>([
    { setNumber: 1, weight: 0, reps: 0, completed: false },
    { setNumber: 2, weight: 0, reps: 0, completed: false },
    { setNumber: 3, weight: 0, reps: 0, completed: false },
  ]);
  const [notes, setNotes] = useState('');

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Exercise not found</Text>
      </View>
    );
  }

  const addSet = () => {
    setSets([...sets, { 
      setNumber: sets.length + 1, 
      weight: sets[sets.length - 1]?.weight || 0, 
      reps: sets[sets.length - 1]?.reps || 0, 
      completed: false 
    }]);
  };

  const removeSet = (index: number) => {
    if (sets.length <= 1) return;
    const newSets = sets.filter((_, i) => i !== index);
    setSets(newSets.map((set, i) => ({ ...set, setNumber: i + 1 })));
  };

  const updateSet = (index: number, field: 'weight' | 'reps', value: number) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: Math.max(0, value) };
    setSets(newSets);
  };

  const toggleSetComplete = (index: number) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], completed: !newSets[index].completed };
    setSets(newSets);
  };

  const handleSave = () => {
    const completedSets = sets.filter(s => s.completed);
    if (completedSets.length === 0) {
      Alert.alert('No Sets Completed', 'Mark at least one set as complete');
      return;
    }

    addExerciseLog({
      id: `log_${Date.now()}_${exerciseId}`,
      exerciseId,
      workoutId,
      programId,
      date: new Date().toISOString(),
      sets,
      notes: notes.trim() || undefined,
    });

    Alert.alert('Success', 'Exercise logged!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Log Exercise',
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
          <Text style={styles.title}>{exercise.name}</Text>
          <Text style={styles.description}>{exercise.description}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sets</Text>
            <TouchableOpacity style={styles.addButton} onPress={addSet}>
              <Plus size={20} color={Colors.secondary} />
              <Text style={styles.addButtonText}>Add Set</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.setColumn]}>Set</Text>
            <Text style={[styles.tableHeaderText, styles.weightColumn]}>Weight (lbs)</Text>
            <Text style={[styles.tableHeaderText, styles.repsColumn]}>Reps</Text>
            <View style={styles.checkColumn} />
          </View>

          {sets.map((set, index) => (
            <View key={index} style={styles.setRow}>
              <View style={styles.setNumberContainer}>
                <Text style={styles.setNumber}>{set.setNumber}</Text>
              </View>

              <View style={styles.inputContainer}>
                <TouchableOpacity 
                  style={styles.adjustButton}
                  onPress={() => updateSet(index, 'weight', set.weight! - 5)}
                >
                  <Minus size={16} color={Colors.text} />
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  value={set.weight?.toString() || '0'}
                  onChangeText={(text) => updateSet(index, 'weight', parseInt(text) || 0)}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textMuted}
                />
                <TouchableOpacity 
                  style={styles.adjustButton}
                  onPress={() => updateSet(index, 'weight', set.weight! + 5)}
                >
                  <Plus size={16} color={Colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <TouchableOpacity 
                  style={styles.adjustButton}
                  onPress={() => updateSet(index, 'reps', set.reps! - 1)}
                >
                  <Minus size={16} color={Colors.text} />
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  value={set.reps?.toString() || '0'}
                  onChangeText={(text) => updateSet(index, 'reps', parseInt(text) || 0)}
                  keyboardType="numeric"
                  placeholderTextColor={Colors.textMuted}
                />
                <TouchableOpacity 
                  style={styles.adjustButton}
                  onPress={() => updateSet(index, 'reps', set.reps! + 1)}
                >
                  <Plus size={16} color={Colors.text} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.checkButton, set.completed && styles.checkButtonActive]}
                onPress={() => toggleSetComplete(index)}
              >
                {set.completed && <Check size={20} color={Colors.white} />}
              </TouchableOpacity>

              {sets.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeSet(index)}
                >
                  <Minus size={16} color={Colors.accent} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes about this exercise..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveGradient}
          >
            <Check size={24} color={Colors.white} />
            <Text style={styles.saveButtonText}>Save Exercise</Text>
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
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.secondary,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  setColumn: {
    width: 40,
  },
  weightColumn: {
    flex: 1,
    textAlign: 'center',
  },
  repsColumn: {
    flex: 1,
    textAlign: 'center',
  },
  checkColumn: {
    width: 44,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  setNumberContainer: {
    width: 40,
    alignItems: 'center',
  },
  setNumber: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  adjustButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    textAlign: 'center',
  },
  checkButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkButtonActive: {
    backgroundColor: Colors.success,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  notesInput: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 100,
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
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 18,
  },
  saveButtonText: {
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
