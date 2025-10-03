import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { Flame, Zap, Trophy, TrendingUp } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useFitness } from '@/contexts/FitnessContext';

const CHART_HEIGHT = 200;

export default function ProgressScreen() {
  const { userProgress } = useFitness();
  const insets = useSafeAreaInsets();

  const maxWorkouts = Math.max(...userProgress.weeklyStats.map(s => s.workouts), 1);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundLight]}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.content}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.title}>Progress</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.statsGrid}>
            <View style={styles.statCardLarge}>
              <LinearGradient
                colors={[Colors.secondary, Colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statGradient}
              >
                <Flame size={32} color={Colors.white} />
                <Text style={styles.statValueLarge}>{userProgress.currentStreak}</Text>
                <Text style={styles.statLabelLarge}>Day Streak</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCardLarge}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statGradient}
              >
                <Zap size={32} color={Colors.white} />
                <Text style={styles.statValueLarge}>{userProgress.totalWorkouts}</Text>
                <Text style={styles.statLabelLarge}>Total Workouts</Text>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weekly Activity</Text>
            <View style={styles.chartCard}>
              <View style={styles.chart}>
                {userProgress.weeklyStats.slice(-8).map((stat, index) => {
                  const barHeight = (stat.workouts / maxWorkouts) * (CHART_HEIGHT - 40);
                  return (
                    <View key={index} style={styles.barContainer}>
                      <View style={styles.barWrapper}>
                        <View 
                          style={[
                            styles.bar,
                            { height: Math.max(barHeight, 4) }
                          ]}
                        >
                          <LinearGradient
                            colors={[Colors.secondary, Colors.primary]}
                            style={StyleSheet.absoluteFill}
                          />
                        </View>
                      </View>
                      <Text style={styles.barLabel}>W{index + 1}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Records</Text>
            {userProgress.personalRecords.length === 0 ? (
              <View style={styles.emptyCard}>
                <Trophy size={48} color={Colors.textMuted} />
                <Text style={styles.emptyText}>No personal records yet</Text>
                <Text style={styles.emptySubtext}>
                  Complete workouts to set your first PR
                </Text>
              </View>
            ) : (
              userProgress.personalRecords.map((record, index) => (
                <View key={index} style={styles.recordCard}>
                  <View style={styles.recordIcon}>
                    <Trophy size={24} color={Colors.secondary} />
                  </View>
                  <View style={styles.recordContent}>
                    <Text style={styles.recordName}>{record.exerciseName}</Text>
                    <Text style={styles.recordDate}>
                      {new Date(record.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.recordValue}>
                    <Text style={styles.recordValueText}>
                      {record.value} {record.type === 'weight' ? 'lbs' : record.type === 'reps' ? 'reps' : 's'}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Milestones</Text>
            <View style={styles.milestoneCard}>
              <View style={styles.milestoneRow}>
                <View style={styles.milestoneIcon}>
                  <Flame size={24} color={Colors.secondary} />
                </View>
                <View style={styles.milestoneContent}>
                  <Text style={styles.milestoneLabel}>Longest Streak</Text>
                  <Text style={styles.milestoneValue}>{userProgress.longestStreak} days</Text>
                </View>
              </View>
            </View>

            <View style={styles.milestoneCard}>
              <View style={styles.milestoneRow}>
                <View style={styles.milestoneIcon}>
                  <TrendingUp size={24} color={Colors.primary} />
                </View>
                <View style={styles.milestoneContent}>
                  <Text style={styles.milestoneLabel}>Total Exercises</Text>
                  <Text style={styles.milestoneValue}>{userProgress.totalExercises}</Text>
                </View>
              </View>
            </View>
          </View>
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
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  statCardLarge: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    height: 160,
  },
  statGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  statValueLarge: {
    fontSize: 40,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  statLabelLarge: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.white,
    opacity: 0.9,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  chartCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chart: {
    flexDirection: 'row',
    height: CHART_HEIGHT,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barWrapper: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 8,
  },
  bar: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  emptyCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recordIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recordContent: {
    flex: 1,
  },
  recordName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  recordDate: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  recordValue: {
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  recordValueText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.secondary,
  },
  milestoneCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  milestoneIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  milestoneValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
});
