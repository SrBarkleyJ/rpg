import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import PlayerAvatar from './PlayerAvatar';
import EnemyDisplay from './EnemyDisplay';
import { spacing } from '../../theme/spacing';

interface CombatAreaProps {
    user: any;
    avatarKey: string;
    activeCombat: any;
    enemyShake: Animated.Value;
    enemyOpacity: Animated.Value;
    damageNumberOpacity: Animated.Value;
    damageNumberY: Animated.Value;
    lastDamage: number;
    playerTranslateX: Animated.Value;
    playerScale: Animated.Value;
    skillAnimation?: React.ReactNode;
}

const CombatArea = ({
    user,
    avatarKey,
    activeCombat,
    enemyShake,
    enemyOpacity,
    damageNumberOpacity,
    damageNumberY,
    lastDamage,
    playerTranslateX,
    playerScale,
    skillAnimation
}: CombatAreaProps) => {
    const { theme } = useTheme();

    return (
        <View style={styles.combatArea}>
            {/* Player Avatar (Left) */}
            <View style={styles.playerContainer}>
                <Animated.View
                    style={{
                        transform: [
                            { translateX: playerTranslateX },
                            { scale: playerScale }
                        ],
                    }}
                >
                    <PlayerAvatar
                        avatarKey={avatarKey}
                        animated={true}
                    />
                </Animated.View>
                <Text style={[styles.playerName, { color: theme.text }]}>{user?.username}</Text>
                <Text style={[styles.playerLevel, { color: theme.secondary }]}>Lvl {user?.level}</Text>
            </View>

            {/* VS Separator */}
            <View style={styles.vsContainer}>
                <Text style={[styles.vsText, { color: theme.warning }]}>⚔️</Text>
            </View>

            {/* Enemy Display */}
            <EnemyDisplay
                activeCombat={activeCombat}
                enemyShake={enemyShake}
                enemyOpacity={enemyOpacity}
                damageNumberOpacity={damageNumberOpacity}
                damageNumberY={damageNumberY}
                lastDamage={lastDamage}
                skillAnimation={skillAnimation}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    combatArea: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
        height: 350,
    },
    playerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playerName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 4,
    },
    playerLevel: {
        fontSize: 14,
        marginTop: 2,
    },
    vsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.md,
    },
    vsText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default CombatArea;