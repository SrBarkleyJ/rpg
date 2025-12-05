import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/apiClient';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import PixelCard from '../../components/UI/Card';
import ProgressBar from '../../components/UI/ProgressBar';
import { calculateNextLevelXp } from '../../utils/levelSystem';

const HomeScreen = () => {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [profile, setProfile] = useState(user);
    const [refreshing, setRefreshing] = useState(false);

    const fetchProfile = async () => {
        try {
            const res = await apiClient.get('/user/profile');
            setProfile(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchProfile();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Sync with user context when it changes
    useEffect(() => {
        if (user) {
            setProfile(user);
        }
    }, [user]);

    if (!profile) return <View style={[styles.container, { backgroundColor: theme.background }]}><Text style={{ color: theme.text }}>{t.loading}</Text></View>;

    const nextLevelXp = calculateNextLevelXp(profile.level);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />}
            >
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: theme.textLight }]}>{t.homeTitle}</Text>
                </View>

                <PixelCard style={[styles.statsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.username, { color: theme.text }]}>{profile?.username}</Text>
                    <Text style={[styles.classText, { color: theme.secondary }]}>{t.classLabel}: {profile?.class || t.novice}</Text>

                    <View style={[styles.divider, { backgroundColor: theme.border }]} />

                    <View style={styles.row}>
                        <Text style={[styles.statLabel, { color: theme.text }]}>{t.level.toUpperCase()}</Text>
                        <Text style={[styles.statValue, { color: theme.text }]}>{profile?.level}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.statLabel, { color: theme.text }]}>{t.gold.toUpperCase()}</Text>
                        <Text style={[styles.statValue, { color: theme.warning }]}>{profile?.gold}</Text>
                    </View>
                </PixelCard>

                <PixelCard style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                    <ProgressBar
                        label={t.xp}
                        current={profile.xp}
                        max={nextLevelXp}
                        color={theme.xpBar}
                    />
                    <ProgressBar
                        label={t.stamina.toUpperCase()}
                        current={profile.stamina || 10}
                        max={10}
                        color={theme.success}
                    />
                </PixelCard>

                <PixelCard style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.questSummary}</Text>
                    <Text style={{ color: theme.text }}>{t.completedQuests}: {profile.completedQuests?.length || 0}</Text>
                </PixelCard>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.md,
        paddingTop: spacing.xl * 2, // Space for status bar
    },
    header: {
        marginBottom: spacing.lg,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 2,
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },
    statsCard: {
        borderWidth: 2,
    },
    username: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    classText: {
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: spacing.md,
    },
    divider: {
        height: 2,
        marginVertical: spacing.md,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    statLabel: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: spacing.sm,
        textDecorationLine: 'underline',
    },
});

export default HomeScreen;
