import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import PixelCard from '../UI/Card';
import CombatLog from '../../screens/combat/CombatLog';

interface AutoCombatViewProps {
    activeCombat: any;
    user: any;
    logs: any[];
    loading: boolean;
    onStartAutoCombat: () => void;
    onBack: () => void;
    scrollViewRef: React.RefObject<ScrollView | null>;
    theme: any;
    t: any;
}

const AutoCombatView: React.FC<AutoCombatViewProps> = ({
    activeCombat,
    user,
    logs,
    loading,
    onStartAutoCombat,
    onBack,
    scrollViewRef,
    theme,
    t
}) => {
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.textLight }]}>⚡ {t.autoCombat}</Text>
            </View>

            <View style={styles.statsContainer}>
                <PixelCard style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.statLabel, { color: theme.text }]}>{t.player} {t.hp}</Text>
                    <Text style={[styles.statValue, { color: theme.success }]}>
                        {activeCombat?.finalPlayerHP || user?.combat?.currentHP}/{user?.combat?.maxHP}
                    </Text>
                </PixelCard>

                {activeCombat && (
                    <PixelCard style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Text style={[styles.statLabel, { color: theme.text }]}>
                            {(activeCombat.enemy.id && t[`enemy_${activeCombat.enemy.id}`] ? t[`enemy_${activeCombat.enemy.id}`] : activeCombat.enemy.name || 'ENEMY').toUpperCase()}
                        </Text>
                        <Text style={[styles.statValue, { color: theme.danger }]}>
                            {activeCombat.finalEnemyHP}/{activeCombat.enemy.maxHP}
                        </Text>
                    </PixelCard>
                )}
            </View>

            <CombatLog
                logs={logs}
                theme={theme}
                scrollViewRef={scrollViewRef}
                t={t}
            />

            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.danger, borderColor: theme.border }]}
                    onPress={onStartAutoCombat}
                    disabled={loading}
                >
                    <Text style={[styles.actionText, { color: theme.textLight }]}>{t.fightIcon}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.smallButton, { backgroundColor: theme.secondary, borderColor: theme.border }]}
                    onPress={onBack}
                >
                    <Text style={[styles.smallButtonText, { color: theme.textLight }]}>← {t.backToMenu}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        marginTop: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    statCard: {
        flex: 2,
        marginHorizontal: 4,
        padding: 8,
        borderWidth: 2,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    logContainer: {
        flex: 1,
        borderWidth: 2,
        marginBottom: 16,
        padding: 8,
        minHeight: 150,
    },
    logContent: {
        paddingBottom: 16,
    },
    logText: {
        fontSize: 13,
        marginBottom: 4,
        fontFamily: 'monospace',
    },
    placeholderText: {
        textAlign: 'center',
        marginTop: 20,
    },
    actionsContainer: {
        gap: 12,
    },
    actionButton: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 2,
        alignItems: 'center',
    },
    actionText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    smallButton: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 2,
        alignItems: 'center',
    },
    smallButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default AutoCombatView;
