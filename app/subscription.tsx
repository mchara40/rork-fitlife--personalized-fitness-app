import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Check, Crown } from 'lucide-react-native';
import { useFitness } from '@/contexts/FitnessContext';
import Colors from '@/constants/colors';
import { SubscriptionPlan } from '@/types/fitness';

interface PlanOption {
  plan: SubscriptionPlan;
  name: string;
  price: number;
  duration: string;
  savings?: string;
  popular?: boolean;
}

const PLANS: PlanOption[] = [
  {
    plan: '1_month',
    name: 'Monthly',
    price: 29.99,
    duration: '1 month',
  },
  {
    plan: '3_months',
    name: 'Quarterly',
    price: 74.99,
    duration: '3 months',
    savings: 'Save 17%',
    popular: true,
  },
  {
    plan: '6_months',
    name: 'Semi-Annual',
    price: 134.99,
    duration: '6 months',
    savings: 'Save 25%',
  },
  {
    plan: '1_year',
    name: 'Annual',
    price: 239.99,
    duration: '12 months',
    savings: 'Save 33%',
  },
];

const FEATURES = [
  'Access to all workout programs',
  'Personalized training plans',
  'Progress tracking & analytics',
  'Exercise video library',
  'Nutrition guidance',
  'Priority support',
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const { updateSubscription, userProfile } = useFitness();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('3_months');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const plan = PLANS.find(p => p.plan === selectedPlan);
      if (!plan) return;

      const startDate = new Date();
      const endDate = new Date();
      
      switch (selectedPlan) {
        case '1_month':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case '3_months':
          endDate.setMonth(endDate.getMonth() + 3);
          break;
        case '6_months':
          endDate.setMonth(endDate.getMonth() + 6);
          break;
        case '1_year':
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
      }

      await updateSubscription({
        plan: selectedPlan,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        isActive: true,
        isTrial: false,
        autoRenew: true,
      });

      Alert.alert(
        'Success!',
        `You have subscribed to the ${plan.name} plan. Enjoy your workouts!`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Subscription error:', error);
      Alert.alert('Error', 'Failed to process subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const isTrial = userProfile?.subscription?.isTrial;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Crown color={Colors.primary} size={40} />
        </View>
        <Text style={styles.title}>Upgrade to Premium</Text>
        <Text style={styles.subtitle}>
          {isTrial ? '14-Day Free Trial Available' : 'Unlock All Features'}
        </Text>
      </View>

      <View style={styles.plansContainer}>
        {PLANS.map((plan) => (
          <TouchableOpacity
            key={plan.plan}
            style={[
              styles.planCard,
              selectedPlan === plan.plan && styles.planCardActive,
              plan.popular && styles.planCardPopular,
            ]}
            onPress={() => setSelectedPlan(plan.plan)}
            activeOpacity={0.7}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>MOST POPULAR</Text>
              </View>
            )}
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planDuration}>{plan.duration}</Text>
            </View>
            <View style={styles.planPricing}>
              <Text style={styles.planPrice}>${plan.price}</Text>
              {plan.savings && (
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsText}>{plan.savings}</Text>
                </View>
              )}
            </View>
            <View style={styles.planCheck}>
              <View
                style={[
                  styles.radio,
                  selectedPlan === plan.plan && styles.radioActive,
                ]}
              >
                {selectedPlan === plan.plan && <View style={styles.radioInner} />}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>What is Included</Text>
        {FEATURES.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Check color={Colors.primary} size={20} />
            </View>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {isTrial && (
        <View style={styles.trialInfo}>
          <Text style={styles.trialText}>
            Start your 14-day free trial. Cancel anytime.
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.subscribeButton, isLoading && styles.subscribeButtonDisabled]}
        onPress={handleSubscribe}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.subscribeButtonText}>
            {isTrial ? 'Start Free Trial' : 'Subscribe Now'}
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        By subscribing, you agree to our Terms of Service and Privacy Policy.
        Subscription will auto-renew unless cancelled.
      </Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  plansContainer: {
    gap: 12,
    marginBottom: 32,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  planCardActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}05`,
  },
  planCardPopular: {
    borderColor: Colors.secondary,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700' as const,
  },
  planHeader: {
    marginBottom: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  planDuration: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.primary,
  },
  savingsBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  savingsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  planCheck: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  featuresContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    color: Colors.text,
    flex: 1,
  },
  trialInfo: {
    backgroundColor: `${Colors.secondary}15`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  trialText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
    fontWeight: '600' as const,
  },
  subscribeButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700' as const,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
});
