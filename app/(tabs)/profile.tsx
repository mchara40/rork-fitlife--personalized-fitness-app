import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { User, Crown, Calendar, CreditCard, Settings, LogOut, ChevronRight, Shield } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useFitness } from '@/contexts/FitnessContext';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { userProfile, hasActiveSubscription, updateSubscription } = useFitness();
  const { isAdmin, logout } = useAuth();
  const insets = useSafeAreaInsets();

  const handleSubscribe = () => {
    router.push('/subscription');
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const handleStartTrial = () => {
    if (userProfile?.trialUsed) {
      Alert.alert('Trial Used', 'You have already used your free trial.');
      return;
    }

    Alert.alert(
      'Start Free Trial',
      '14 days free trial. Cancel anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start Trial',
          onPress: () => {
            updateSubscription({
              plan: '1_month',
              startDate: new Date().toISOString(),
              endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              isActive: true,
              isTrial: true,
              autoRenew: false,
            });
            Alert.alert('Success', 'Free trial activated!');
          },
        },
      ]
    );
  };

  const daysRemaining = userProfile?.subscription 
    ? Math.ceil((new Date(userProfile.subscription.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.background, Colors.backgroundLight]}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.content}>
        <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                style={styles.avatar}
              >
                <User size={40} color={Colors.white} />
              </LinearGradient>
            </View>
            <Text style={styles.profileName}>{userProfile?.name}</Text>
            <Text style={styles.profileEmail}>{userProfile?.email}</Text>
          </View>

          {hasActiveSubscription ? (
            <View style={styles.subscriptionCard}>
              <LinearGradient
                colors={[Colors.primary, Colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.subscriptionGradient}
              >
                <View style={styles.subscriptionHeader}>
                  <Crown size={32} color={Colors.white} fill={Colors.white} />
                  <View style={styles.subscriptionBadge}>
                    <Text style={styles.subscriptionBadgeText}>
                      {userProfile?.subscription?.isTrial ? 'FREE TRIAL' : 'PRO'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.subscriptionTitle}>
                  {userProfile?.subscription?.isTrial ? 'Free Trial Active' : 'Premium Member'}
                </Text>
                <Text style={styles.subscriptionSubtitle}>
                  {daysRemaining} days remaining
                </Text>
                <View style={styles.subscriptionFeatures}>
                  <Text style={styles.subscriptionFeature}>✓ Unlimited access to all programs</Text>
                  <Text style={styles.subscriptionFeature}>✓ Advanced progress tracking</Text>
                  <Text style={styles.subscriptionFeature}>✓ Personalized recommendations</Text>
                </View>
              </LinearGradient>
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Start Your Journey</Text>
              <TouchableOpacity 
                style={styles.trialCard}
                onPress={handleStartTrial}
                disabled={userProfile?.trialUsed}
              >
                <LinearGradient
                  colors={userProfile?.trialUsed ? [Colors.textMuted, Colors.textMuted] : [Colors.primary, Colors.secondary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.trialGradient}
                >
                  <Crown size={32} color={Colors.white} fill={Colors.white} />
                  <Text style={styles.trialTitle}>
                    {userProfile?.trialUsed ? 'Trial Used' : '14-Day Free Trial'}
                  </Text>
                  <Text style={styles.trialSubtitle}>
                    {userProfile?.trialUsed ? 'Subscribe to continue' : 'Full access, cancel anytime'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subscription</Text>
            <TouchableOpacity
              style={styles.planCard}
              onPress={handleSubscribe}
            >
              <View style={styles.menuIcon}>
                <Crown size={20} color={Colors.primary} />
              </View>
              <View style={styles.planContent}>
                <Text style={styles.planLabel}>Manage Subscription</Text>
                <Text style={styles.planSubtext}>View plans and upgrade</Text>
              </View>
              <ChevronRight size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            {isAdmin && (
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => router.push('/admin/dashboard')}
              >
                <View style={styles.menuIcon}>
                  <Shield size={20} color={Colors.primary} />
                </View>
                <Text style={styles.menuText}>Admin Dashboard</Text>
                <ChevronRight size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <Calendar size={20} color={Colors.text} />
              </View>
              <Text style={styles.menuText}>Workout Schedule</Text>
              <ChevronRight size={20} color={Colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <CreditCard size={20} color={Colors.text} />
              </View>
              <Text style={styles.menuText}>Payment Methods</Text>
              <ChevronRight size={20} color={Colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <Settings size={20} color={Colors.text} />
              </View>
              <Text style={styles.menuText}>App Settings</Text>
              <ChevronRight size={20} color={Colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <View style={styles.menuIcon}>
                <LogOut size={20} color={Colors.accent} />
              </View>
              <Text style={[styles.menuText, { color: Colors.accent }]}>Log Out</Text>
            </TouchableOpacity>
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
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  subscriptionCard: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
  },
  subscriptionGradient: {
    padding: 24,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subscriptionBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  subscriptionBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  subscriptionTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 4,
  },
  subscriptionSubtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 16,
  },
  subscriptionFeatures: {
    gap: 8,
  },
  subscriptionFeature: {
    fontSize: 14,
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
  trialCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  trialGradient: {
    padding: 24,
    alignItems: 'center',
  },
  trialTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.white,
    marginTop: 12,
    marginBottom: 4,
  },
  trialSubtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  planContent: {
    flex: 1,
  },
  planInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  planLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  planSubtext: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
  },
  savingsBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.secondary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
});
