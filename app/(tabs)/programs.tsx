import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { useFitness } from '@/contexts/FitnessContext';
import { workoutPrograms } from '@/mocks/programs';
import { WorkoutGoal } from '@/types/fitness';

const goalFilters: { label: string; value: WorkoutGoal | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Muscle Building', value: 'muscle_building' },
  { label: 'Hybrid', value: 'functional_hybrid' },
  { label: 'Combat Sports', value: 'combat_sports' },
  { label: 'Strength', value: 'strength' },
];

export default function ProgramsScreen() {
  const router = useRouter();
  const { hasActiveSubscription } = useFitness();
  const insets = useSafeAreaInsets();
  const [selectedGoal, setSelectedGoal] = useState<WorkoutGoal | 'all'>('all');

  const filteredPrograms = workoutPrograms.filter(program => {
    if (selectedGoal === 'all') return true;
    return program.goal === selectedGoal;
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundLight]}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.content}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.title}>Programs</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {goalFilters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterChip,
                selectedGoal === filter.value && styles.filterChipActive
              ]}
              onPress={() => setSelectedGoal(filter.value)}
            >
              <Text style={[
                styles.filterChipText,
                selectedGoal === filter.value && styles.filterChipTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredPrograms.map((program) => (
            <TouchableOpacity
              key={program.id}
              style={styles.programCard}
              onPress={() => router.push(`/program/${program.id}` as any)}
            >
              <Image 
                source={{ uri: program.thumbnailUrl }} 
                style={styles.programImage}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.programGradient}
              />
              
              {program.isPremium && !hasActiveSubscription && (
                <View style={styles.lockBadge}>
                  <Lock size={16} color={Colors.white} />
                </View>
              )}

              <View style={styles.programContent}>
                <View style={styles.programBadges}>
                  <View style={styles.programBadge}>
                    <Text style={styles.programBadgeText}>{program.difficulty}</Text>
                  </View>
                  <View style={styles.programBadge}>
                    <Text style={styles.programBadgeText}>{program.duration} weeks</Text>
                  </View>
                  {program.gender !== 'all' && (
                    <View style={styles.programBadge}>
                      <Text style={styles.programBadgeText}>{program.gender}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.programTitle}>{program.name}</Text>
                <Text style={styles.programDescription} numberOfLines={2}>
                  {program.description}
                </Text>
                <Text style={styles.programWorkouts}>
                  {program.workouts.length} workouts
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterScroll: {
    maxHeight: 50,
    marginBottom: 16,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  programCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundCard,
    height: 280,
  },
  programImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  programGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  lockBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  programContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  programBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  programBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  programBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.white,
    textTransform: 'capitalize',
  },
  programTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 8,
  },
  programDescription: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 12,
  },
  programWorkouts: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.white,
    opacity: 0.8,
  },
});
