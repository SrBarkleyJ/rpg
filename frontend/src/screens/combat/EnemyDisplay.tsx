import React from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import { BASE_URL } from '../../config/api';

interface EnemyDisplayProps {
    activeCombat: any;
    enemyShake: Animated.Value;
    enemyOpacity: Animated.Value;
    damageNumberOpacity: Animated.Value;
    damageNumberY: Animated.Value;
    lastDamage: number;
    skillAnimation?: React.ReactNode; // Animación de skill para renderizar sobre el enemigo
}

const EnemyDisplay: React.FC<EnemyDisplayProps> = ({
    activeCombat,
    enemyShake,
    enemyOpacity,
    damageNumberOpacity,
    damageNumberY,
    lastDamage,
    skillAnimation,
}) => {
    const { theme } = useTheme();
    const { t } = useLanguage();

    // Imagen de fallback local
    const calvoImage = require('../../../assets/images/calvo.jpg');

    const getEnemyImageUrl = (imageName: string) => {
        if (!imageName) return null;
        return `${BASE_URL}/images/enemies/${imageName}`;
    };

    const getTierColor = (tier: number) => {
        const colors: Record<number, string> = {
            1: '#4ade80', // Green
            2: '#60a5fa', // Blue
            3: '#a78bfa', // Purple
            4: '#f97316', // Orange
            5: '#ef4444'  // Red
        };
        return colors[tier] || colors[1];
    };

    return (
        <View style={styles.enemyContainer}>
            {activeCombat ? (
                <>
                    <Animated.View
                        style={{
                            transform: [{ translateX: enemyShake }],
                            opacity: enemyOpacity,
                        }}
                    >
                        <View style={styles.enemyImageContainer}>
                            <Image
                                source={
                                    activeCombat.enemy?.image
                                        ? { uri: getEnemyImageUrl(activeCombat.enemy.image) }
                                        : calvoImage
                                }
                                style={styles.enemyImage}
                                resizeMode="contain"
                            />
                            {/* Skill Animation Overlay */}
                            {skillAnimation && (
                                <View style={styles.skillAnimationContainer}>
                                    {skillAnimation}
                                </View>
                            )}
                            {/* Damage Number Animation */}
                            <Animated.Text
                                style={[
                                    styles.damageNumber,
                                    {
                                        opacity: damageNumberOpacity,
                                        transform: [{ translateY: damageNumberY }],
                                    },
                                ]}
                            >
                                -{lastDamage}
                            </Animated.Text>
                        </View>
                    </Animated.View>
                    <View style={styles.enemyInfo}>
                        <View style={styles.enemyHeader}>
                            <Text style={[styles.enemyName, { color: theme.text }]}>
                                {activeCombat.enemy?.name || 'Unknown Enemy'}
                            </Text>
                            {activeCombat.enemy?.tier && (
                                <View
                                    style={[
                                        styles.tierBadge,
                                        { backgroundColor: getTierColor(activeCombat.enemy.tier) },
                                    ]}
                                >
                                    <Text style={styles.tierText}>
                                        T{activeCombat.enemy.tier}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Text style={[styles.enemyLevel, { color: theme.text }]}>
                            Lvl {activeCombat.enemy?.level || '?'}
                        </Text>
                    </View>
                </>
            ) : (
                <Text style={[styles.placeholderText, { color: theme.text }]}>{t.noEnemy}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    enemyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    enemyImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    enemyImage: {
        width: 210,
        height: 210,
    },
    skillAnimationContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    enemyInfo: {
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    enemyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    enemyName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    enemyLevel: {
        fontSize: 14,
        marginTop: 4,
    },
    tierBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#fff',
    },
    tierText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
    },
    damageNumber: {
        position: 'absolute',
        top: -20,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ff0000',
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },
    placeholderText: {
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default EnemyDisplay;