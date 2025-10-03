import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { Flame, Zap, Trophy, ChevronRight, Play } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { useFitness } from '@/contexts/FitnessContext';
import { workoutPrograms } from '@/mocks/programs';

export default function HomeScreen() {
  const router = useRouter();
  const { userProgress, hasActiveSubscription } = useFitness();
  const insets = useSafeAreaInsets();

  const featuredPrograms = workoutPrograms.filter(p => p.isPremium).slice(0, 3);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundLight]}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome Back</Text>
              <Text style={styles.title}>Ready to Train?</Text>
            </View>
            {hasActiveSubscription && (
              <View style={styles.premiumBadge}>
                <Zap size={16} color={Colors.secondary} fill={Colors.secondary} />
                <Text style={styles.premiumText}>PRO</Text>
              </View>
            )}
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Flame size={24} color={Colors.secondary} />
              </View>
              <Text style={styles.statValue}>{userProgress.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Zap size={24} color={Colors.primary} />
              </View>
              <Text style={styles.statValue}>{userProgress.totalWorkouts}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Trophy size={24} color={Colors.accent} />
              </View>
              <Text style={styles.statValue}>{userProgress.personalRecords.length}</Text>
              <Text style={styles.statLabel}>PRs</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Programs</Text>
              <TouchableOpacity 
                onPress={() => router.push('/(tabs)/programs')}
                style={styles.seeAllButton}
              >
                <Text style={styles.seeAllText}>See All</Text>
                <ChevronRight size={16} color={Colors.secondary} />
              </TouchableOpacity>
            </View>

            {featuredPrograms.map((program) => (
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
                <View style={styles.programContent}>
                  <View style={styles.programBadges}>
                    <View style={styles.programBadge}>
                      <Text style={styles.programBadgeText}>{program.difficulty}</Text>
                    </View>
                    <View style={styles.programBadge}>
                      <Text style={styles.programBadgeText}>{program.duration} weeks</Text>
                    </View>
                  </View>
                  <Text style={styles.programTitle}>{program.name}</Text>
                  <Text style={styles.programDescription} numberOfLines={2}>
                    {program.description}
                  </Text>
                  <View style={styles.programFooter}>
                    <Text style={styles.programWorkouts}>
                      {program.workouts.length} workouts
                    </Text>
                    <View style={styles.playButton}>
                      <Play size={16} color={Colors.white} fill={Colors.white} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {!hasActiveSubscription && (
            <TouchableOpacity 
              style={styles.upgradeCard}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.upgradeGradient}
              >
                <View style={styles.upgradeContent}>
                  <Zap size={32} color={Colors.white} fill={Colors.white} />
                  <View style={styles.upgradeText}>
                    <Text style={styles.upgradeTitle}>Unlock All Programs</Text>
                    <Text style={styles.upgradeSubtitle}>
                      Get unlimited access to premium workouts
                    </Text>
                  </View>
                  <ChevronRight size={24} color={Colors.white} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  premiumText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.secondary,
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
  programContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  programBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
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
  programFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  programWorkouts: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.white,
    opacity: 0.8,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  upgradeGradient: {
    padding: 24,
  },
  upgradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  upgradeText: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 4,
  },
  upgradeSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
  },
});
