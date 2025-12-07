import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import PixelCard from '../UI/Card';
import { spacing } from '../../theme/spacing';

interface CombatResultModalProps {
    visible: boolean;
    type: 'victory' | 'defeat';
    data: any;
    onClose: () => void;
}

const CombatResultModal: React.FC<CombatResultModalProps> = ({ visible, type, data, onClose }) => {
    const { theme } = useTheme();
    const { t } = useLanguage();

    if (!visible || !data) return null;

    const isVictory = type === 'victory';

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <PixelCard style={[styles.card, { backgroundColor: theme.surface, borderColor: isVictory ? theme.success : theme.danger }]}>
                    <View style={[styles.header, { backgroundColor: isVictory ? theme.success : theme.danger }]}>
                        <Text style={[styles.title, theme.typography.h1, { color: theme.textLight }]}>
                            {isVictory ? (t.victory || 'VICTORY') : (t.defeat || 'DEFEAT')}
                        </Text>
                    </View>

                    <ScrollView contentContainerStyle={styles.content}>
                        {isVictory ? (
                            <>
                                <Text style={[styles.message, theme.typography.body, { color: theme.text }]}>
                                    {t.victoryMessage || 'You have defeated the enemy!'}
                                </Text>

                                <View style={styles.rewardsContainer}>
                                    <Text style={[styles.sectionTitle, theme.typography.h3, { color: theme.text }]}>{t.rewards || 'REWARDS'}</Text>

                                    <View style={[styles.rewardRow, { borderBottomColor: theme.border }]}>
                                        <Text style={[styles.rewardLabel, theme.typography.body, { color: theme.text }]}>Gold</Text>
                                        <Text style={[styles.rewardValue, theme.typography.bodyBold, { color: theme.warning }]}>+{data.rewards?.goldGained || 0}</Text>
                                    </View>

                                    <View style={[styles.rewardRow, { borderBottomColor: theme.border }]}>
                                        <Text style={[styles.rewardLabel, theme.typography.body, { color: theme.text }]}>XP</Text>
                                        <Text style={[styles.rewardValue, theme.typography.bodyBold, { color: theme.success }]}>+{data.rewards?.xpGained || 0}</Text>
                                    </View>

                                    {data.rewards?.tetranutaDropped && (
                                        <View style={[styles.rewardRow, { borderBottomColor: theme.border }]}>
                                            <Text style={[styles.rewardLabel, theme.typography.body, { color: theme.text }]}>Tetranuta</Text>
                                            <Text style={[styles.rewardValue, theme.typography.bodyBold, { color: theme.primary }]}>+1</Text>
                                        </View>
                                    )}
                                </View>

                                {data.leveledUp && (
                                    <View style={[styles.levelUpContainer, { backgroundColor: theme.success }]}>
                                        <Text style={[styles.levelUpText, theme.typography.h2, { color: theme.textLight }]}>
                                            {t.levelUp || 'LEVEL UP!'}
                                        </Text>
                                        <Text style={[styles.levelUpSubtext, theme.typography.body, { color: theme.textLight }]}>
                                            {t.nowLevel || 'Now level'} {data.newLevel}
                                        </Text>
                                    </View>
                                )}

                                {data.dungeonComplete ? (
                                    <View style={[styles.infoContainer, { backgroundColor: theme.primary }]}>
                                        <Text style={[styles.infoText, theme.typography.bodyBold, { color: theme.textLight }]}>
                                            {t.dungeonCompleted || 'DUNGEON COMPLETED!'}
                                        </Text>
                                    </View>
                                ) : data.nextEnemy && (
                                    <View style={[styles.infoContainer, { backgroundColor: theme.secondary }]}>
                                        <Text style={[styles.infoLabel, theme.typography.small, { color: theme.textLight }]}>{t.nextEnemy || 'NEXT ENEMY'}</Text>
                                        <Text style={[styles.infoText, theme.typography.bodyBold, { color: theme.textLight }]}>{data.nextEnemy.name}</Text>
                                    </View>
                                )}
                            </>
                        ) : (
                            <>
                                <Text style={[styles.message, theme.typography.body, { color: theme.text }]}>
                                    {t.defeatMessage || 'You were defeated in battle...'}
                                </Text>
                                <View style={[styles.lossContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                    <Text style={[styles.lossText, theme.typography.body, { color: theme.danger }]}>
                                        {t.goldLost || 'Gold Lost'}: -{data.goldLost || 0}
                                    </Text>
                                </View>
                            </>
                        )}
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: isVictory ? theme.success : theme.danger, borderColor: theme.border }]}
                        onPress={onClose}
                    >
                        <Text style={[styles.buttonText, theme.typography.h3, { color: theme.textLight }]}>
                            {t.continue || 'CONTINUE'}
                        </Text>
                    </TouchableOpacity>
                </PixelCard>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    card: {
        width: '100%',
        maxHeight: '80%',
        padding: 0,
        overflow: 'hidden',
    },
    header: {
        padding: spacing.md,
        alignItems: 'center',
        borderBottomWidth: 4,
        borderBottomColor: 'rgba(0,0,0,0.2)',
    },
    title: {
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    content: {
        padding: spacing.lg,
    },
    message: {
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    rewardsContainer: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        marginBottom: spacing.sm,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    rewardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderStyle: 'dashed',
    },
    rewardLabel: {},
    rewardValue: {},
    levelUpContainer: {
        padding: spacing.md,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: spacing.lg,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    levelUpText: {
        marginBottom: 4,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    levelUpSubtext: {},
    infoContainer: {
        padding: spacing.md,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    infoLabel: {
        opacity: 0.8,
        marginBottom: 2,
    },
    infoText: {},
    lossContainer: {
        padding: spacing.md,
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    lossText: {},
    button: {
        margin: spacing.md,
        padding: spacing.md,
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 2,
        borderBottomWidth: 6,
    },
    buttonText: {
        textTransform: 'uppercase',
    }
});

export default CombatResultModal;
