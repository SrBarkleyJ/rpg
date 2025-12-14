import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import PixelCard from '../../components/UI/Card';
import { spacing } from '../../theme/spacing';

const { width, height } = Dimensions.get('window');

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
    const { t } = useLanguage();
    
    // Calcular porcentajes basados en altura de pantalla
    const containerHeight = height * 0.2; // 20% de la altura
    const cardPadding = height * 0.01; // 1% de altura
    const hpBarHeight = height * 0.008; // 0.8% de altura
    
    return (
        <View style={[styles.statsContainer, { height: containerHeight }]}>
            {/* Player Stats */}
            <PixelCard style={[
                styles.statCard, 
                { 
                    backgroundColor: theme.surface, 
                    borderColor: theme.border,
                    padding: cardPadding,
                }
            ]}>
                <View style={styles.statHeader}>
                    <Text style={[styles.statLabel, { 
                        color: theme.text,
                        fontSize: width * 0.035 // 3.5% del ancho
                    }]}>
                        {t.player}
                    </Text>
                    {defending && (
                        <Text style={[styles.defendingBadge, { 
                            color: theme.warning,
                            fontSize: width * 0.03 // 3% del ancho
                        }]}>
                            {t.defendingIcon}
                        </Text>
                    )}
                </View>
                
                {/* HP Value */}
                <Text style={[styles.statValue, { 
                    color: theme.success,
                    fontSize: width * 0.045 // 4.5% del ancho
                }]}>
                    {activeCombat?.playerHP || user?.combat?.currentHP || 0}/{user?.combat?.maxHP || 0}
                </Text>

                {/* HP Bar */}
                <View style={[
                    styles.hpBarBg, 
                    { 
                        backgroundColor: '#333',
                        height: hpBarHeight,
                        borderRadius: hpBarHeight / 2,
                    }
                ]}>
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

                {/* Mana Bar (solo si hay suficiente espacio) */}
                {height > 600 && (
                    <>
                        <Text style={{ 
                            marginTop: height * 0.01, 
                            fontSize: width * 0.03,
                            color: theme.text 
                        }}>
                            MP: {activeCombat?.playerMana || user?.combat?.currentMana || 0}/{user?.combat?.maxMana || 0}
                        </Text>
                        <View style={[
                            styles.hpBarBg, 
                            { 
                                backgroundColor: '#333', 
                                marginTop: height * 0.005,
                                height: hpBarHeight,
                                borderRadius: hpBarHeight / 2,
                            }
                        ]}>
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
                    </>
                )}
            </PixelCard>

            {/* Enemy Stats */}
            {activeCombat && activeCombat.enemy && (
                <PixelCard style={[
                    styles.statCard, 
                    { 
                        backgroundColor: theme.surface, 
                        borderColor: theme.border,
                        padding: cardPadding,
                    }
                ]}>
                    <Text style={[styles.statLabel, { 
                        color: theme.text,
                        fontSize: width * 0.035
                    }]}>
                        {(activeCombat.enemy.id && t[`enemy_${activeCombat.enemy.id}`] ? t[`enemy_${activeCombat.enemy.id}`] : activeCombat.enemy.name || 'ENEMY').toUpperCase()}
                    </Text>
                    
                    {/* HP Value */}
                    <Text style={[styles.statValue, { 
                        color: theme.danger,
                        fontSize: width * 0.045
                    }]}>
                        {activeCombat.enemyHP || 0}/{activeCombat.enemy?.maxHP || 0}
                    </Text>

                    {/* HP Bar */}
                    <View style={[
                        styles.hpBarBg, 
                        { 
                            backgroundColor: '#333',
                            height: hpBarHeight,
                            borderRadius: hpBarHeight / 2,
                        }
                    ]}>
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
                    
                    {/* Indicador de enemigo débil */}
                    {activeCombat.enemyHP < activeCombat.enemy?.maxHP * 0.3 && (
                        <Text style={[
                            styles.weakIndicator,
                            { 
                                color: theme.warning,
                                fontSize: width * 0.025,
                                marginTop: height * 0.005
                            }
                        ]}>
                            💀 {t.weak || 'DÉBIL'}
                        </Text>
                    )}
                </PixelCard>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    statCard: {
        flex: 1,
        marginHorizontal: width * 0.01, // 1% del ancho
        borderWidth: 0,
        justifyContent: 'center',
        borderRadius: 15,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: height * 0.01,
    },
    statLabel: {
        fontWeight: 'bold',
    },
    defendingBadge: {
        fontWeight: 'bold',
    },
    statValue: {
        fontWeight: 'bold',
        marginBottom: height * 0.01,
    },
    hpBarBg: {
        width: '100%',
        overflow: 'hidden',
    },
    hpBarFill: {
        height: '100%',
    },
    weakIndicator: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CombatStats;