import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';
import { WorkoutGoal, Gender } from '@/types/fitness';

const GOALS: { value: WorkoutGoal; label: string }[] = [
  { value: 'muscle_building', label: 'Muscle Building' },
  { value: 'functional_hybrid', label: 'Functional Hybrid' },
  { value: 'combat_sports', label: 'Combat Sports' },
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'strength', label: 'Strength' },
];

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const;
const GENDERS: Gender[] = ['male', 'female', 'all'];

export default function AddProgramScreen() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState<WorkoutGoal>('muscle_building');
  const [gender, setGender] = useState<Gender>('all');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [duration, setDuration] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isPremium, setIsPremium] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Access Denied</Text>
      </View>
    );
  }

  const handleSubmit = async () => {
    if (!name || !description || !duration) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Creating program:', {
        name,
        description,
        goal,
        gender,
        difficulty,
        duration: parseInt(duration),
        thumbnailUrl,
        isPremium,
      });
      
      Alert.alert('Success', 'Program created successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error creating program:', error);
      Alert.alert('Error', 'Failed to create program');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Program Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g., 12-Week Muscle Builder"
        placeholderTextColor={Colors.textMuted}
      />

      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Describe the program..."
        placeholderTextColor={Colors.textMuted}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Goal</Text>
      <View style={styles.chipContainer}>
        {GOALS.map((g) => (
          <TouchableOpacity
            key={g.value}
            style={[styles.chip, goal === g.value && styles.chipActive]}
            onPress={() => setGoal(g.value)}
          >
            <Text style={[styles.chipText, goal === g.value && styles.chipTextActive]}>
              {g.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Gender</Text>
      <View style={styles.buttonGroup}>
        {GENDERS.map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.button, gender === g && styles.buttonActive]}
            onPress={() => setGender(g)}
          >
            <Text style={[styles.buttonText, gender === g && styles.buttonTextActive]}>
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Difficulty</Text>
      <View style={styles.buttonGroup}>
        {DIFFICULTIES.map((d) => (
          <TouchableOpacity
            key={d}
            style={[styles.button, difficulty === d && styles.buttonActive]}
            onPress={() => setDifficulty(d)}
          >
            <Text style={[styles.buttonText, difficulty === d && styles.buttonTextActive]}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Duration (weeks) *</Text>
      <TextInput
        style={styles.input}
        value={duration}
        onChangeText={setDuration}
        placeholder="e.g., 12"
        placeholderTextColor={Colors.textMuted}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Thumbnail URL</Text>
      <TextInput
        style={styles.input}
        value={thumbnailUrl}
        onChangeText={setThumbnailUrl}
        placeholder="https://..."
        placeholderTextColor={Colors.textMuted}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setIsPremium(!isPremium)}
      >
        <View style={[styles.checkbox, isPremium && styles.checkboxActive]}>
          {isPremium && <View style={styles.checkboxInner} />}
        </View>
        <Text style={styles.checkboxLabel}>Premium Program (Requires Subscription)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Create Program</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 14,
    color: Colors.text,
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600' as const,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  buttonText: {
    fontSize: 14,
    color: Colors.text,
  },
  buttonTextActive: {
    color: '#fff',
    fontWeight: '600' as const,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  checkboxLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 40,
  },
});
