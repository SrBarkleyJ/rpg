import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import PixelCard from '../../components/UI/Card';
import { spacing } from '../../theme/spacing';

interface CombatStatsProps {
    user: any;
    activeCombat: any;
    defending: boolean;
    theme: any;
}

const CombatStats: React.FC<CombatStatsProps> = ({
    user,
    activeCombat,
    defending,
    theme,
}) => {
    return (
        <View style={styles.statsContainer}>
            {/* Player Stats */}
            <PixelCard style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.statHeader}>
                    <Text style={[styles.statLabel, { color: theme.text }]}>PLAYER</Text>
                    {defending && (
                        <Text style={[styles.defendingBadge, { color: theme.warning }]}>🛡️ DEFENDING</Text>
                    )}
                </View>
                <Text style={[styles.statValue, { color: theme.success }]}>
                    {activeCombat?.playerHP || user?.combat?.currentHP || 0}/{user?.combat?.maxHP || 0}
                </Text>

                {/* HP Bar */}
                <View style={[styles.hpBarBg, { backgroundColor: '#333' }]}>
                    <View
                        style={[
                            styles.hpBarFill,
                            {
                                backgroundColor: theme.success,
                                width: `${Math.min(100, ((activeCombat?.playerHP || user?.combat?.currentHP || 0) / (user?.combat?.maxHP || 1)) * 100)}%`,
                            },
                        ]}
                    />
                </View>

                {/* Mana Bar */}
                <Text style={{ marginTop: 8, fontSize: 12, color: theme.text }}>
                    MP: {activeCombat?.playerMana || user?.combat?.currentMana || 0}/{user?.combat?.maxMana || 0}
                </Text>
                <View style={[styles.hpBarBg, { backgroundColor: '#333', marginTop: 2 }]}>
                    <View
                        style={[
                            styles.hpBarFill,
                            {
                                backgroundColor: '#3b82f6',
                                width: `${Math.min(100, ((activeCombat?.playerMana || user?.combat?.currentMana || 0) / (user?.combat?.maxMana || 1)) * 100)}%`,
                            },
                        ]}
                    />
                </View>
            </PixelCard>

            {/* Enemy Stats */}
            {activeCombat && activeCombat.enemy && (
                <PixelCard style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.statLabel, { color: theme.text }]}>
                        {activeCombat.enemy.name?.toUpperCase() || 'ENEMY'}
                    </Text>
                    <Text style={[styles.statValue, { color: theme.danger }]}>
                        {activeCombat.enemyHP || 0}/{activeCombat.enemy?.maxHP || 0}
                    </Text>

                    {/* HP Bar */}
                    <View style={[styles.hpBarBg, { backgroundColor: '#333' }]}>
                        <View
                            style={[
                                styles.hpBarFill,
                                {
                                    backgroundColor: theme.danger,
                                    width: `${Math.min(100, ((activeCombat.enemyHP || 0) / (activeCombat.enemy?.maxHP || 1)) * 100)}%`,
                                },
                            ]}
                        />
                    </View>
                </PixelCard>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    statCard: {
        flex: 1,
        marginHorizontal: 4,
        padding: spacing.sm,
        borderWidth: 2,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    defendingBadge: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    hpBarBg: {
        width: '100%',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    hpBarFill: {
        height: '100%',
    },
});

export default CombatStats;