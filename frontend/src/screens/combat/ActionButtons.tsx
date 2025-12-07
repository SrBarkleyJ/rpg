import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/spacing';

interface ActionButtonsProps {
    activeCombat: any;
    playerTurn: boolean;
    loading: boolean;
    combatMode: string | null;
    onInitiateCombat: () => void;
    onAttack: () => void;
    onDefend: () => void;
    onOpenSkills: () => void;
    onOpenInventory: () => void;
    onBackToMenu: () => void;
    theme: any;
    t: any;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
    activeCombat,
    playerTurn,
    loading,
    combatMode,
    onInitiateCombat,
    onAttack,
    onDefend,
    onOpenSkills,
    onOpenInventory,
    onBackToMenu,
    theme,
    t,
}) => {
    return (
        <View style={styles.actionsContainer}>
            {!activeCombat || activeCombat.status !== 'active' ? (
                <>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.danger, borderColor: theme.border }]}
                        onPress={onInitiateCombat}
                        disabled={loading}
                    >
                        <Text style={[styles.actionText, { color: theme.textLight }]}>
                            {activeCombat?.dungeonInfo ? `➡️ ${t.nextEnemy}` : `⚔️ ${t.startCombatButton}`}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.smallButton, { backgroundColor: theme.secondary, borderColor: theme.border }]}
                        onPress={onBackToMenu}
                    >
                        <Text style={[styles.smallButtonText, { color: theme.textLight }]}>{t.menuArrow}</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <View style={styles.combatActions}>
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            { backgroundColor: theme.danger, borderColor: theme.border, opacity: playerTurn && !loading ? 1 : 0.5 }
                        ]}
                        onPress={onAttack}
                        disabled={!playerTurn || loading}
                    >
                        <Text style={[styles.actionText, { color: theme.textLight }]}>
                            ⚔️ {t.attack?.toUpperCase()}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            {
                                backgroundColor: theme.warning,
                                borderColor: theme.border,
                                opacity: playerTurn && !loading ? 1 : 0.5,
                                marginTop: spacing.sm
                            }
                        ]}
                        onPress={onOpenSkills}
                        disabled={!playerTurn || loading}
                    >
                        <Text style={[styles.actionText, { color: theme.textLight }]}>{t.skillsIcon}</Text>
                    </TouchableOpacity>

                    <View style={styles.secondaryActions}>
                        <TouchableOpacity
                            style={[
                                styles.smallButton,
                                { backgroundColor: theme.primary, borderColor: theme.border, opacity: playerTurn && !loading ? 1 : 0.5 }
                            ]}
                            onPress={onDefend}
                            disabled={!playerTurn || loading}
                        >
                            <Text style={[styles.smallButtonText, { color: theme.textLight }]}>
                                🛡️ {t.defend}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.smallButton,
                                { backgroundColor: theme.warning, borderColor: theme.border, opacity: playerTurn && !loading ? 1 : 0.5 }
                            ]}
                            onPress={onOpenInventory}
                            disabled={!playerTurn || loading}
                        >
                            <Text style={[styles.smallButtonText, { color: '#000' }]}>
                                💊 {t.useItem}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    actionsContainer: {
        marginBottom: spacing.md,
    },
    combatActions: {},
    actionButton: {
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 2,
        marginBottom: spacing.sm,
    },
    actionText: {
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    secondaryActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    smallButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 2,
        marginHorizontal: 4,
    },
    smallButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default ActionButtons;