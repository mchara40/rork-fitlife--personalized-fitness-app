import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Clock, Zap, Lock, Play } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useFitness } from '@/contexts/FitnessContext';
import { getProgramById } from '@/mocks/programs';

export default function ProgramDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { hasActiveSubscription } = useFitness();
  
  const program = getProgramById(id);

  if (!program) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Program not found</Text>
      </View>
    );
  }

  const canAccess = !program.isPremium || hasActiveSubscription;

  const handleWorkoutPress = (workoutId: string) => {
    if (!canAccess) {
      Alert.alert(
        'Premium Required',
        'Subscribe to access this program',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Subscribe', onPress: () => router.push('/(tabs)/profile') },
        ]
      );
      return;
    }
    router.push(`/workout/${workoutId}` as any);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: program.name,
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
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: program.thumbnailUrl }} 
            style={styles.heroImage}
          />
          <LinearGradient
            colors={['transparent', Colors.background]}
            style={styles.heroGradient}
          />
          
          {!canAccess && (
            <View style={styles.lockOverlay}>
              <View style={styles.lockBadge}>
                <Lock size={32} color={Colors.white} />
                <Text style={styles.lockText}>Premium Only</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.headerSection}>
            <View style={styles.badges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{program.difficulty}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{program.duration} weeks</Text>
              </View>
              {program.gender !== 'all' && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{program.gender}</Text>
                </View>
              )}
            </View>

            <Text style={styles.title}>{program.name}</Text>
            <Text style={styles.description}>{program.description}</Text>

            <View style={styles.stats}>
              <View style={styles.statItem}>
                <Zap size={20} color={Colors.secondary} />
                <Text style={styles.statText}>{program.workouts.length} Workouts</Text>
              </View>
              <View style={styles.statItem}>
                <Clock size={20} color={Colors.primary} />
                <Text style={styles.statText}>{program.duration} Weeks</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workouts</Text>
            {program.workouts.map((workout, index) => (
              <TouchableOpacity
                key={workout.id}
                style={styles.workoutCard}
                onPress={() => handleWorkoutPress(workout.id)}
              >
                <View style={styles.workoutNumber}>
                  <Text style={styles.workoutNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.workoutContent}>
                  <Text style={styles.workoutName}>{workout.name}</Text>
                  <Text style={styles.workoutDescription} numberOfLines={1}>
                    {workout.description}
                  </Text>
                  <View style={styles.workoutMeta}>
                    <View style={styles.workoutMetaItem}>
                      <Clock size={14} color={Colors.textSecondary} />
                      <Text style={styles.workoutMetaText}>{workout.duration} min</Text>
                    </View>
                    <View style={styles.workoutMetaItem}>
                      <Zap size={14} color={Colors.textSecondary} />
                      <Text style={styles.workoutMetaText}>{workout.exercises.length} exercises</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.playButton}>
                  {canAccess ? (
                    <Play size={20} color={Colors.white} fill={Colors.white} />
                  ) : (
                    <Lock size={20} color={Colors.white} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {!canAccess && (
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.upgradeGradient}
              >
                <Lock size={24} color={Colors.white} />
                <Text style={styles.upgradeText}>Subscribe to Unlock</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
    paddingBottom: 32,
  },
  heroContainer: {
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockBadge: {
    alignItems: 'center',
    gap: 12,
  },
  lockText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  content: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 32,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: Colors.backgroundCard,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text,
    textTransform: 'capitalize',
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  workoutNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workoutNumberText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.secondary,
  },
  workoutContent: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  workoutDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  workoutMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  workoutMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  workoutMetaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    marginTop: 100,
  },
  upgradeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 20,
  },
  upgradeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 18,
  },
  upgradeText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.white,
  },
});
