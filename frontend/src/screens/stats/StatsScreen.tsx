import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import statsApi from '../../api/statsApi';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import PixelCard from '../../components/UI/Card';

const StatsScreen = () => {
    const { user, updateUser } = useAuth();
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await statsApi.getStats();
            setStats(data);
        } catch (error) {
            console.error(error);
            Alert.alert(t.error, t.failedToLoadStats);
        } finally {
            setLoading(false);
        }
    };

    const handleAssignPoint = async (statName) => {
        try {
            const result = await statsApi.assignSkillPoint(statName);
            setStats({
                ...stats,
                stats: result.stats,
                skillPoints: result.skillPoints,
                combat: result.combat
            });
            await updateUser(result.user);
            Alert.alert(t.success, result.message);
        } catch (error) {
            Alert.alert(t.error, error.response?.data?.message || t.failedToAssign);
        }
    };

    if (loading || !stats) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text }}>{t.loading}</Text>
            </View>
        );
    }

    const statInfo = [
        { key: 'strength', label: t.strength, desc: t.physicalDamage, icon: '⚔️' },
        { key: 'intelligence', label: t.intelligence, desc: t.magicalDamage, icon: '🔮' },
        { key: 'vitality', label: t.vitality, desc: t.maxHP, icon: '❤️' },
        { key: 'dexterity', label: t.dexterity, desc: t.criticalChance, icon: '🎯' },
        { key: 'luck', label: t.luckStat, desc: t.lootAndCrits, icon: '🍀' }
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.textLight }]}>{t.statsTitle}</Text>
            </View>

            <PixelCard style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.skillPointsAvailable}</Text>
                <Text style={[styles.skillPoints, { color: theme.warning }]}>{stats.skillPoints}</Text>
                <Text style={[styles.hint, { color: theme.text }]}>{t.skillPointsHint}</Text>
            </PixelCard>

            <PixelCard style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.attributes}</Text>
                {statInfo.map(stat => (
                    <View key={stat.key} style={[styles.statRow, { borderBottomColor: theme.border }]}>
                        <View style={styles.statInfo}>
                            <Text style={styles.statIcon}>{stat.icon}</Text>
                            <View>
                                <Text style={[styles.statLabel, { color: theme.text }]}>{stat.label}</Text>
                                <Text style={[styles.statDesc, { color: theme.text }]}>{stat.desc}</Text>
                            </View>
                        </View>
                        <View style={styles.statValue}>
                            <Text style={[styles.statNumber, { color: theme.text }]}>{stats.stats[stat.key]}</Text>
                            {stats.skillPoints > 0 && (
                                <TouchableOpacity
                                    style={[styles.plusButton, { backgroundColor: theme.success, borderColor: theme.border }]}
                                    onPress={() => handleAssignPoint(stat.key)}
                                >
                                    <Text style={[styles.plusText, { color: theme.textLight }]}>+</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                ))}
            </PixelCard>

            <PixelCard style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.calculatedStats}</Text>
                <View style={styles.calcRow}>
                    <Text style={[styles.calcLabel, { color: theme.text }]}>{t.physicalDamage}:</Text>
                    <Text style={[styles.calcValue, { color: theme.primary }]}>{stats.calculatedPhysicalDamage}</Text>
                </View>
                <View style={styles.calcRow}>
                    <Text style={[styles.calcLabel, { color: theme.text }]}>{t.magicalDamage}:</Text>
                    <Text style={[styles.calcValue, { color: theme.primary }]}>{stats.calculatedMagicalDamage}</Text>
                </View>
                <View style={styles.calcRow}>
                    <Text style={[styles.calcLabel, { color: theme.text }]}>{t.maxHP}:</Text>
                    <Text style={[styles.calcValue, { color: theme.primary }]}>{stats.calculatedMaxHP}</Text>
                </View>
                <View style={styles.calcRow}>
                    <Text style={[styles.calcLabel, { color: theme.text }]}>{t.criticalChance}:</Text>
                    <Text style={[styles.calcValue, { color: theme.primary }]}>{stats.calculatedCritChance.toFixed(1)}%</Text>
                </View>
            </PixelCard>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: spacing.md, paddingTop: spacing.xl * 2 },
    header: { alignItems: 'center', marginBottom: spacing.lg },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 2,
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: spacing.sm,
        textDecorationLine: 'underline',
    },
    skillPoints: {
        fontSize: 48,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: spacing.md
    },
    hint: { fontSize: 12, textAlign: 'center', fontStyle: 'italic', opacity: 0.7 },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
    },
    statInfo: { flexDirection: 'row', alignItems: 'center' },
    statIcon: { fontSize: 24, marginRight: spacing.sm },
    statLabel: { fontSize: 18, fontWeight: 'bold' },
    statDesc: { fontSize: 12, opacity: 0.7 },
    statValue: { flexDirection: 'row', alignItems: 'center' },
    statNumber: { fontSize: 24, fontWeight: 'bold', marginRight: spacing.sm },
    plusButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    plusText: { fontSize: 20, fontWeight: 'bold', marginTop: -2 },
    calcRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4
    },
    calcLabel: { fontSize: 14 },
    calcValue: { fontSize: 14, fontWeight: 'bold' }
});

export default StatsScreen;
