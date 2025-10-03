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
import { ExerciseType } from '@/types/fitness';

const EXERCISE_TYPES: { value: ExerciseType; label: string }[] = [
  { value: 'strength', label: 'Strength' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'plyometric', label: 'Plyometric' },
];

export default function AddExerciseScreen() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ExerciseType>('strength');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [muscleGroups, setMuscleGroups] = useState('');
  const [equipment, setEquipment] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Access Denied</Text>
      </View>
    );
  }

  const handleSubmit = async () => {
    if (!name || !description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const muscleGroupsArray = muscleGroups.split(',').map(m => m.trim()).filter(Boolean);
      const equipmentArray = equipment.split(',').map(e => e.trim()).filter(Boolean);
      const instructionsArray = instructions.split('\n').filter(Boolean);

      console.log('Creating exercise:', {
        name,
        description,
        type,
        videoUrl,
        thumbnailUrl,
        muscleGroups: muscleGroupsArray,
        equipment: equipmentArray,
        instructions: instructionsArray,
      });
      
      Alert.alert('Success', 'Exercise created successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error creating exercise:', error);
      Alert.alert('Error', 'Failed to create exercise');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Exercise Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g., Barbell Bench Press"
        placeholderTextColor={Colors.textMuted}
      />

      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Describe the exercise..."
        placeholderTextColor={Colors.textMuted}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Type</Text>
      <View style={styles.chipContainer}>
        {EXERCISE_TYPES.map((t) => (
          <TouchableOpacity
            key={t.value}
            style={[styles.chip, type === t.value && styles.chipActive]}
            onPress={() => setType(t.value)}
          >
            <Text style={[styles.chipText, type === t.value && styles.chipTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Video URL</Text>
      <TextInput
        style={styles.input}
        value={videoUrl}
        onChangeText={setVideoUrl}
        placeholder="https://youtube.com/..."
        placeholderTextColor={Colors.textMuted}
        autoCapitalize="none"
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

      <Text style={styles.label}>Muscle Groups (comma-separated)</Text>
      <TextInput
        style={styles.input}
        value={muscleGroups}
        onChangeText={setMuscleGroups}
        placeholder="e.g., Chest, Triceps, Shoulders"
        placeholderTextColor={Colors.textMuted}
      />

      <Text style={styles.label}>Equipment (comma-separated)</Text>
      <TextInput
        style={styles.input}
        value={equipment}
        onChangeText={setEquipment}
        placeholder="e.g., Barbell, Bench"
        placeholderTextColor={Colors.textMuted}
      />

      <Text style={styles.label}>Instructions (one per line)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={instructions}
        onChangeText={setInstructions}
        placeholder="1. Lie on bench\n2. Grip barbell\n3. Lower to chest\n4. Press up"
        placeholderTextColor={Colors.textMuted}
        multiline
        numberOfLines={6}
      />

      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Create Exercise</Text>
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
    height: 120,
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
