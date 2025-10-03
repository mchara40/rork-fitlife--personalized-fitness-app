import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Dumbbell, ListChecks, Users, Settings } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';

export default function AdminDashboard() {
    const router = useRouter();
    const { isAdmin, session } = useAuth();

    if (!isAdmin) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Access Denied: Admin Only</Text>
            </View>
        );
    }

    const adminCards = [
        {
            title: 'Add Program',
            description: 'Create new workout program',
            icon: Plus,
            color: Colors.primary,
            route: '/admin/add-program',
        },
        {
            title: 'Add Exercise',
            description: 'Add new exercise to library',
            icon: Dumbbell,
            color: Colors.secondary,
            route: '/admin/add-exercise',
        },
        {
            title: 'Manage Programs',
            description: 'Edit or delete programs',
            icon: ListChecks,
            color: '#10b981',
            route: '/admin/manage-programs',
        },
        {
            title: 'User Management',
            description: 'View and manage users',
            icon: Users,
            color: '#f59e0b',
            route: '/admin/users',
        },
    ];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <View style={styles.headerIcon}>
                    <Settings color={Colors.primary} size={32} />
                </View>
                <Text style={styles.title}>Admin Dashboard</Text>
                <Text style={styles.subtitle}>Welcome, {session?.name}</Text>
            </View>

            <View style={styles.grid}>
                {adminCards.map((card, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.card}
                        onPress={() => router.push(card.route as any)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.cardIcon, { backgroundColor: `${card.color}15` }]}>
                            <card.icon color={card.color} size={32} />
                        </View>
                        <Text style={styles.cardTitle}>{card.title}</Text>
                        <Text style={styles.cardDescription}>{card.description}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.statsContainer}>
                <Text style={styles.statsTitle}>Quick Stats</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Programs</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>48</Text>
                        <Text style={styles.statLabel}>Exercises</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>156</Text>
                        <Text style={styles.statLabel}>Users</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>89</Text>
                        <Text style={styles.statLabel}>Active Subs</Text>
                    </View>
                </View>
            </View>
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
    headerIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
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
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 32,
    },
    card: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: Colors.text,
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 13,
        color: Colors.textMuted,
        lineHeight: 18,
    },
    statsContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: Colors.text,
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statCard: {
        width: '48%',
        backgroundColor: Colors.background,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 32,
        fontWeight: '800' as const,
        color: Colors.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: Colors.textMuted,
    },
    errorText: {
        fontSize: 18,
        color: '#ef4444',
        textAlign: 'center',
        marginTop: 40,
    },
});