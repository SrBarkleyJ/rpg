import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import AnimatedPressable from '../../components/UI/AnimatedPressable';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/spacing';

const { width, height } = Dimensions.get('window');

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
    // Dimensiones basadas en porcentajes
    const containerHeight = height * 0.4; // 40% de la altura
    const mainButtonHeight = height * 0.08; // 8% de altura
    const secondaryButtonHeight = height * 0.06; // 6% de altura
    const mainButtonFontSize = width * 0.05; // 5% del ancho
    const secondaryButtonFontSize = width * 0.04; // 4% del ancho
    const buttonGap = height * 0.015; // 1.5% de altura

    return (
        <View style={[styles.actionsContainer, { height: containerHeight }]}>
            {!activeCombat || activeCombat.status !== 'active' ? (
                <>
                    {/* Botón de iniciar combate */}
                    <AnimatedPressable
                        style={[
                            styles.actionButton, 
                            { 
                                backgroundColor: theme.danger, 
                                borderColor: theme.border,
                                height: mainButtonHeight,
                                marginBottom: buttonGap,
                            }
                        ]}
                        onPress={onInitiateCombat}
                        disabled={loading}
                    >
                        <Text style={[
                            styles.actionText,
                            { 
                                color: theme.textLight,
                                fontSize: mainButtonFontSize
                            }
                        ]}>
                            {activeCombat?.dungeonInfo ? `➡️ ${t.nextEnemy}` : `⚔️ ${t.startCombatButton}`}
                        </Text>
                    </AnimatedPressable>
                    
                    {/* Botón de volver al menú */}
                    <TouchableOpacity
                        style={[
                            styles.smallButton,
                            { 
                                backgroundColor: theme.secondary, 
                                borderColor: theme.border,
                                height: secondaryButtonHeight,
                            }
                        ]}
                        onPress={onBackToMenu}
                    >
                        <Text style={[
                            styles.smallButtonText,
                            { 
                                color: theme.textLight,
                                fontSize: secondaryButtonFontSize
                            }
                        ]}>
                            {t.menuArrow}
                        </Text>
                    </TouchableOpacity>
                </>
            ) : (
                <View style={[styles.combatActions, { gap: buttonGap }]}>
                    {/* Botón principal de ataque */}
                    <AnimatedPressable
                        style={[
                            styles.actionButton,
                            { 
                                backgroundColor: theme.danger, 
                                borderColor: theme.border, 
                                opacity: playerTurn && !loading ? 1 : 0.5,
                                height: mainButtonHeight,
                            }
                        ]}
                        onPress={onAttack}
                        disabled={!playerTurn || loading}
                    >
                        <Text style={[
                            styles.actionText,
                            { 
                                color: theme.textLight,
                                fontSize: mainButtonFontSize
                            }
                        ]}>
                            ⚔️ {t.attack?.toUpperCase()}
                        </Text>
                    </AnimatedPressable>

                    {/* Botón de habilidades */}
                    <AnimatedPressable
                        style={[
                            styles.actionButton,
                            {
                                backgroundColor: theme.warning,
                                borderColor: theme.border,
                                opacity: playerTurn && !loading ? 1 : 0.5,
                                height: mainButtonHeight,
                            }
                        ]}
                        onPress={onOpenSkills}
                        disabled={!playerTurn || loading}
                    >
                        <Text style={[
                            styles.actionText,
                            { 
                                color: theme.textLight,
                                fontSize: mainButtonFontSize
                            }
                        ]}>
                            {t.skillsIcon}
                        </Text>
                    </AnimatedPressable>

                    {/* Botones secundarios */}
                    <View style={[styles.secondaryActions, { gap: width * 0.03 }]}>
                        {/* Defender */}
                        <TouchableOpacity
                            style={[
                                styles.smallButton,
                                { 
                                    backgroundColor: theme.primary, 
                                    borderColor: theme.border, 
                                    opacity: playerTurn && !loading ? 1 : 0.5,
                                    height: secondaryButtonHeight,
                                    flex: 1.2,
                                }
                            ]}
                            onPress={onDefend}
                            disabled={!playerTurn || loading}
                        >
                            <Text style={[
                                styles.smallButtonText,
                                { 
                                    color: theme.textLight,
                                    fontSize: secondaryButtonFontSize
                                }
                            ]}>
                                🛡️ {height > 600 ? t.defend : ''}
                            </Text>
                        </TouchableOpacity>

                        {/* Inventario */}
                        <TouchableOpacity
                            style={[
                                styles.smallButton,
                                { 
                                    backgroundColor: '#fbbf24', 
                                    borderColor: theme.border, 
                                    opacity: playerTurn && !loading ? 1 : 0.5,
                                    height: secondaryButtonHeight,
                                    flex: 1,
                                }
                            ]}
                            onPress={onOpenInventory}
                            disabled={!playerTurn || loading}
                        >
                            <Text style={[
                                styles.smallButtonText,
                                { 
                                    color: '#000',
                                    fontSize: secondaryButtonFontSize,
                                    fontWeight: 'bold'
                                }
                            ]}>
                                💊 {height > 600 ? t.useItem : ''}
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
        width: '100%',
    },
    combatActions: {
        width: '100%',
    },
    actionButton: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 2,
    },
    actionText: {
        fontWeight: 'bold',
        letterSpacing: 1,
        textAlign: 'center',
    },
    secondaryActions: {
        flexDirection: 'row',
        width: '100%',
    },
    smallButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        borderWidth: 2,
    },
    smallButtonText: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ActionButtons;