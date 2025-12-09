import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/apiClient';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import PixelCard from '../../components/UI/Card';
import ProgressBar from '../../components/UI/ProgressBar';
import { calculateNextLevelXp } from '../../utils/levelSystem';
import { AVATAR_MAP } from '../../screens/combat/combatConstants';
import ProfileSkeleton from '../../components/skeletons/ProfileSkeleton';
import { useNavigation } from '@react-navigation/native';



const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const { user, logout, updateUser } = useAuth();

    const { theme } = useTheme();
    const { t, language, toggleLanguage } = useLanguage();
    const [profile, setProfile] = useState(user);

    const [refreshing, setRefreshing] = useState(false);

    const fetchProfile = async () => {
        try {
            const res = await apiClient.get('/user/profile');
            setProfile(res.data);
            updateUser(res.data); // Update context user
        } catch (err) {
            console.error(err);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchProfile();
        setRefreshing(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [])
    );

    // Sync with user context when it changes
    useEffect(() => {
        if (user) {
            setProfile(user);
        }
    }, [user]);

    if (!profile) return (
        <View style={[styles.container, { backgroundColor: theme.background, padding: spacing.md }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, theme.typography.h1, { color: theme.textLight }]}>{t.homeTitle}</Text>
            </View>
            <ProfileSkeleton />
        </View>
    );

    const nextLevelXp = calculateNextLevelXp(profile.level);
    const avatarSource = AVATAR_MAP[profile?.avatar];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />}
            >
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, theme.typography.h1, { color: theme.textLight }]}>{t.homeTitle}</Text>
                </View>

                {/* Main Profile Card */}
                <PixelCard style={[styles.statsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>

                    <View style={styles.profileHeader}>
                        <View style={[styles.avatarContainer, { borderColor: theme.border }]}>
                            <Image source={avatarSource} style={styles.avatar} />
                        </View>

                        <View style={styles.profileInfo}>
                            <Text style={[styles.username, theme.typography.h2, { color: theme.text }]}>{profile?.username}</Text>
                            <Text style={[styles.classText, theme.typography.body, { color: theme.secondary }]}>
                                {profile?.class ? profile.class.charAt(0).toUpperCase() + profile.class.slice(1) : t.novice}
                            </Text>
                            <Text style={[styles.levelText, theme.typography.bodyBold, { color: theme.text }]}>{t.level} {profile?.level}</Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: theme.border }]} />

                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, theme.typography.h3, { color: theme.warning }]}>{profile?.gold}</Text>
                            <Text style={[styles.statLabel, theme.typography.small, { color: theme.textLight }]}>{t.gold}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, theme.typography.h3, { color: theme.primary }]}>{profile?.tetranuta || 0}</Text>
                            <Text style={[styles.statLabel, theme.typography.small, { color: theme.textLight }]}>{t.tetranuta}</Text>
                        </View>
                    </View>
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, theme.typography.h3, { color: theme.secondary }]}>{profile?.skillPoints || 0}</Text>
                            <Text style={[styles.statLabel, theme.typography.small, { color: theme.textLight }]}>{t.skillPoints}</Text>
                        </View>
                    </View>
                </PixelCard>

                {/* Progress Bars */}
                <PixelCard style={{ backgroundColor: theme.surface, borderColor: theme.border, marginBottom: spacing.md }}>
                    <ProgressBar
                        label={t.xp}
                        current={profile.xp}
                        max={nextLevelXp}
                        color={theme.xpBar}
                    />
                    <View style={{ height: spacing.sm }} />
                    <ProgressBar
                        label={t.stamina.toUpperCase()}
                        current={profile.stamina || 10}
                        max={10}
                        color={theme.success}
                    />
                </PixelCard>

                {/* Quest Summary */}
                <PixelCard style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                    <Text style={[styles.sectionTitle, theme.typography.h3, { color: theme.text }]}>{t.questSummary}</Text>
                    <Text style={[theme.typography.body, { color: theme.text }]}>{t.completedQuests}: {profile.completedQuests?.length || 0}</Text>
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
        paddingTop: spacing.xl,
        paddingBottom: 90,
    },
    header: {
        marginBottom: spacing.lg,
        alignItems: 'center',
    },
    headerTitle: {
        textAlign: 'center',
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },
    statsCard: {
        borderWidth: 2,
        marginBottom: spacing.md,
        padding: spacing.md,
    },
    profileHeader: {
        alignItems: 'center', // Centered Column
        marginBottom: spacing.md,
    },
    avatarContainer: {
        width: '50%',  // Increased size
        height: 333, // Increased size
        borderRadius: 10,
        borderWidth: 4,
        overflow: 'hidden',
        marginBottom: spacing.md,
        backgroundColor: '#585855ff',
    },
    avatar: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    profileInfo: {
        alignItems: 'center',
    },
    username: {
        marginBottom: 4,
    },

    classText: {
        marginBottom: 4,
        fontStyle: 'italic',
    },
    levelText: {
    },
    divider: {
        height: 2,
        marginVertical: spacing.md,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
    },
    statLabel: {
        marginTop: 2,
        opacity: 0.8,
    },
    sectionTitle: {
        marginBottom: spacing.sm,
        textDecorationLine: 'underline',
    },
});

export default HomeScreen;
