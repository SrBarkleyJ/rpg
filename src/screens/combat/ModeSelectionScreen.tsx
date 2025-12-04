import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { spacing } from '../../theme/spacing';
import PixelCard from '../../components/UI/Card';

interface ModeSelectionScreenProps {
    onSelectMode: (mode: 'auto' | 'manual') => void;
    onSelectDungeon: () => void;
    onContinueDungeon: () => void;
    onRest: () => void;
    hasActiveDungeon: boolean;
    loading: boolean;
}

const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({
    onSelectMode,
    onSelectDungeon,
    onContinueDungeon,
    onRest,
    hasActiveDungeon,
    loading
}) => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [showSingleCombatSubmenu, setShowSingleCombatSubmenu] = useState(false);

    // Main menu
    if (!showSingleCombatSubmenu) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: theme.textLight }]}>
                        {t.combatTitle || 'COMBAT'}
                    </Text>
                </View>

                <View style={styles.modeSelectionContainer}>
                    <Text style={[styles.modeTitle, { color: theme.text }]}>
                        {t.selectCombatMode || 'Select Combat Mode'}
                    </Text>

                    {/* Single Combat Button */}
                    <TouchableOpacity
                        style={[styles.modeButton, { backgroundColor: theme.danger, borderColor: theme.border }]}
                        onPress={() => setShowSingleCombatSubmenu(true)}
                    >
                        <Text style={[styles.modeButtonTitle, { color: theme.textLight }]}>
                            ⚔️ Single Combat
                        </Text>
                        <Text style={[styles.modeButtonDesc, { color: theme.textLight }]}>
                            Fight a single enemy
                        </Text>
                    </TouchableOpacity>

                    {/* Dungeon Button */}
                    <TouchableOpacity
                        style={[styles.modeButton, { backgroundColor: '#8b5cf6', borderColor: theme.border }]}
                        onPress={onSelectDungeon}
                        disabled={loading}
                    >
                        <Text style={[styles.modeButtonTitle, { color: theme.textLight }]}>
                            🏰 Dungeon Run
                        </Text>
                        <Text style={[styles.modeButtonDesc, { color: theme.textLight }]}>
                            Multi-enemy challenges with epic rewards
                        </Text>
                    </TouchableOpacity>

                    {/* Continue Dungeon Button */}
                    {hasActiveDungeon && (
                        <TouchableOpacity
                            style={[styles.modeButton, { backgroundColor: '#a855f7', borderColor: theme.border }]}
                            onPress={onContinueDungeon}
                            disabled={loading}
                        >
                            <Text style={[styles.modeButtonTitle, { color: theme.textLight }]}>
                                🔄 Continue Dungeon
                            </Text>
                            <Text style={[styles.modeButtonDesc, { color: theme.textLight }]}>
                                Resume your dungeon adventure
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* Rest Button */}
                    <TouchableOpacity
                        style={[styles.restButton, { backgroundColor: theme.success, borderColor: theme.border }]}
                        onPress={onRest}
                        disabled={loading}
                    >
                        <Text style={[styles.smallButtonText, { color: theme.textLight }]}>
                            😴 {t.rest || 'Rest'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Player Stats */}
                <View style={styles.statsDisplay}>
                    <PixelCard style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Text style={[styles.statLabel, { color: theme.text }]}>
                            {t.yourHP || 'Your HP'}
                        </Text>
                        <Text style={[styles.statValue, { color: theme.success }]}>
                            {user?.combat?.currentHP}/{user?.combat?.maxHP}
                        </Text>
                    </PixelCard>
                </View>
            </View>
        );
    }

    // Single Combat Submenu
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.textLight }]}>
                    ⚔️ Single Combat
                </Text>
            </View>

            <View style={styles.modeSelectionContainer}>
                <Text style={[styles.modeTitle, { color: theme.text }]}>
                    Choose Combat Type
                </Text>

                {/* Auto Combat Button */}
                <TouchableOpacity
                    style={[styles.modeButton, { backgroundColor: theme.danger, borderColor: theme.border }]}
                    onPress={() => onSelectMode('auto')}
                >
                    <Text style={[styles.modeButtonTitle, { color: theme.textLight }]}>
                        🤖 Auto Combat
                    </Text>
                    <Text style={[styles.modeButtonDesc, { color: theme.textLight }]}>
                        Fast AI-controlled combat
                    </Text>
                </TouchableOpacity>

                {/* Manual Combat Button */}
                <TouchableOpacity
                    style={[styles.modeButton, { backgroundColor: theme.primary, borderColor: theme.border }]}
                    onPress={() => onSelectMode('manual')}
                >
                    <Text style={[styles.modeButtonTitle, { color: theme.textLight }]}>
                        🎮 Manual Combat
                    </Text>
                    <Text style={[styles.modeButtonDesc, { color: theme.textLight }]}>
                        Turn-based tactical combat
                    </Text>
                </TouchableOpacity>

                {/* Back Button */}
                <TouchableOpacity
                    style={[styles.restButton, { backgroundColor: theme.secondary, borderColor: theme.border }]}
                    onPress={() => setShowSingleCombatSubmenu(false)}
                >
                    <Text style={[styles.smallButtonText, { color: theme.textLight }]}>
                        ← Back to Main Menu
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Player Stats */}
            <View style={styles.statsDisplay}>
                <PixelCard style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.statLabel, { color: theme.text }]}>
                        {t.yourHP || 'Your HP'}
                    </Text>
                    <Text style={[styles.statValue, { color: theme.success }]}>
                        {user?.combat?.currentHP}/{user?.combat?.maxHP}
                    </Text>
                </PixelCard>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
        marginTop: spacing.md,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 2,
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        textAlign: 'center',
    },
    modeSelectionContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    modeTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    modeButton: {
        padding: spacing.lg,
        borderRadius: 8,
        borderWidth: 3,
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    modeButtonTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: spacing.sm,
    },
    modeButtonDesc: {
        fontSize: 14,
        textAlign: 'center',
    },
    restButton: {
        padding: spacing.md,
        borderRadius: 8,
        borderWidth: 2,
        alignItems: 'center',
        marginTop: spacing.md,
    },
    smallButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    statsDisplay: {
        marginTop: spacing.lg,
    },
    statCard: {
        flex: 1,
        marginHorizontal: 4,
        padding: spacing.sm,
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
});

export default ModeSelectionScreen;
