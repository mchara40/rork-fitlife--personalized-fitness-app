import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { 
  Check, 
  Crown, 
  Zap, 
  Star,
  ArrowLeft,
  CreditCard,
  Shield,
  Clock
} from 'lucide-react-native';

import Colors from '@/constants/colors';
import { useFitness } from '@/contexts/FitnessContext';
import { SubscriptionPlan } from '@/types/fitness';

const subscriptionPlans: {
  plan: SubscriptionPlan;
  label: string;
  price: string;
  originalPrice?: string;
  savings?: string;
  popular?: boolean;
  features: string[];
}[] = [
  {
    plan: '1_month',
    label: '1 Month',
    price: '$29.99',
    features: [
      'Unlimited workout programs',
      'Progress tracking',
      'Exercise library access',
      'Basic analytics'
    ]
  },
  {
    plan: '3_months',
    label: '3 Months',
    price: '$74.99',
    originalPrice: '$89.97',
    savings: 'Save 17%',
    features: [
      'Everything in 1 Month',
      'Advanced analytics',
      'Personalized recommendations',
      'Priority support'
    ]
  },
  {
    plan: '6_months',
    label: '6 Months',
    price: '$134.99',
    originalPrice: '$179.94',
    savings: 'Save 25%',
    popular: true,
    features: [
      'Everything in 3 Months',
      'Custom workout plans',
      'Nutrition tracking',
      'Community access'
    ]
  },
  {
    plan: '1_year',
    label: '1 Year',
    price: '$239.99',
    originalPrice: '$359.88',
    savings: 'Save 33%',
    features: [
      'Everything in 6 Months',
      '1-on-1 coaching sessions',
      'Advanced meal planning',
      'Lifetime updates'
    ]
  }
];

export default function SubscriptionPlansScreen() {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('6_months');
  const [isLoading, setIsLoading] = useState(false);
  
  const { userProfile, updateSubscription } = useFitness();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (userProfile?.trialUsed) {
      Alert.alert(
        'Trial Used',
        'You have already used your free trial. Please choose a subscription plan.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, this would integrate with Stripe
      // For now, we'll simulate the subscription creation
      const duration = plan === '1_month' ? 30 : 
                     plan === '3_months' ? 90 : 
                     plan === '6_months' ? 180 : 365;
      
      await updateSubscription({
        plan,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        isTrial: false,
        autoRenew: true,
      });
      
      Alert.alert(
        'Success!',
        'Your subscription has been activated. Welcome to premium!',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to activate subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTrial = async () => {
    if (userProfile?.trialUsed) {
      Alert.alert('Trial Used', 'You have already used your free trial.');
      return;
    }

    setIsLoading(true);
    try {
      await updateSubscription({
        plan: '1_month',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        isTrial: true,
        autoRenew: false,
      });
      
      Alert.alert(
        'Trial Started!',
        'Your 14-day free trial is now active. Enjoy full access!',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to start trial. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

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
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Choose Your Plan</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.heroSection}>
          <LinearGradient
            colors={[Colors.primary, Colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <Crown size={48} color={Colors.white} fill={Colors.white} />
            <Text style={styles.heroTitle}>Unlock Your Potential</Text>
            <Text style={styles.heroSubtitle}>
              Get unlimited access to all premium features and transform your fitness journey
            </Text>
          </LinearGradient>
        </View>

        {!userProfile?.trialUsed && (
          <View style={styles.trialSection}>
            <TouchableOpacity 
              style={styles.trialCard}
              onPress={handleStartTrial}
              disabled={isLoading}
            >
              <LinearGradient
                colors={[Colors.success, Colors.success + 'CC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.trialGradient}
              >
                <Zap size={32} color={Colors.white} fill={Colors.white} />
                <Text style={styles.trialTitle}>14-Day Free Trial</Text>
                <Text style={styles.trialSubtitle}>
                  Try premium features risk-free. Cancel anytime.
                </Text>
                <View style={styles.trialFeatures}>
                  <Text style={styles.trialFeature}>✓ Full access to all programs</Text>
                  <Text style={styles.trialFeature}>✓ Advanced progress tracking</Text>
                  <Text style={styles.trialFeature}>✓ No commitment required</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Subscription Plans</Text>
          {subscriptionPlans.map((plan) => (
            <TouchableOpacity
              key={plan.plan}
              style={[
                styles.planCard,
                selectedPlan === plan.plan && styles.planCardSelected,
                plan.popular && styles.planCardPopular
              ]}
              onPress={() => setSelectedPlan(plan.plan)}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Star size={16} color={Colors.white} fill={Colors.white} />
                  <Text style={styles.popularText}>Most Popular</Text>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <View style={styles.planInfo}>
                  <Text style={styles.planLabel}>{plan.label}</Text>
                  {plan.savings && (
                    <View style={styles.savingsBadge}>
                      <Text style={styles.savingsText}>{plan.savings}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.planPricing}>
                  <Text style={styles.planPrice}>{plan.price}</Text>
                  {plan.originalPrice && (
                    <Text style={styles.planOriginalPrice}>{plan.originalPrice}</Text>
                  )}
                </View>
              </View>

              <View style={styles.planFeatures}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.planFeature}>
                    <Check size={16} color={Colors.success} />
                    <Text style={styles.planFeatureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {selectedPlan === plan.plan && (
                <View style={styles.selectedIndicator}>
                  <Check size={20} color={Colors.white} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.securitySection}>
          <View style={styles.securityItem}>
            <Shield size={20} color={Colors.success} />
            <Text style={styles.securityText}>Secure payment processing</Text>
          </View>
          <View style={styles.securityItem}>
            <CreditCard size={20} color={Colors.success} />
            <Text style={styles.securityText}>Cancel anytime</Text>
          </View>
          <View style={styles.securityItem}>
            <Clock size={20} color={Colors.success} />
            <Text style={styles.securityText}>Instant activation</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.subscribeButton, isLoading && styles.subscribeButtonDisabled]}
          onPress={() => handleSubscribe(selectedPlan)}
          disabled={isLoading}
        >
          <LinearGradient
            colors={isLoading ? [Colors.textMuted, Colors.textMuted] : [Colors.primary, Colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.subscribeGradient}
          >
            <Text style={styles.subscribeButtonText}>
              {isLoading ? 'Processing...' : 'Subscribe Now'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  heroSection: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroGradient: {
    padding: 32,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.white,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 24,
  },
  trialSection: {
    marginHorizontal: 20,
    marginBottom: 32,
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
    marginBottom: 8,
  },
  trialSubtitle: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 16,
  },
  trialFeatures: {
    gap: 8,
  },
  trialFeature: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
  },
  plansSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: 20,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  planCardPopular: {
    borderColor: Colors.secondary,
  },
  popularBadge: {
    position: 'absolute',
    top: -1,
    right: 20,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planInfo: {
    flex: 1,
  },
  planLabel: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  savingsBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  planPricing: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  planOriginalPrice: {
    fontSize: 16,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  planFeatures: {
    gap: 12,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planFeatureText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  securitySection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 32,
    paddingVertical: 16,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  securityText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  subscribeButton: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  subscribeGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.white,
  },
});
