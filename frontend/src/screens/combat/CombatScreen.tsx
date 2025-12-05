import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Modal,
    FlatList,
    Animated,
    Easing
} from 'react-native';
import combatApi from '../../api/combatApi';
import inventoryApi from '../../api/inventoryApi';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import PixelCard from '../../components/UI/Card';
import DungeonSelectionScreen from './DungeonSelectionScreen';
import ModeSelectionScreen from './ModeSelectionScreen';

// Importar componentes separados
import CombatArea from './CombatArea';
import CombatStats from './CombatStats';
import ActionButtons from './ActionButtons';
import CombatLog from './CombatLog';
import InventoryModal from './InventoryModal';
import SkillsModal from './SkillsModal';

// Importar hooks
import { usePlayerAvatar } from '../../hooks/usePlayerAvatar';
import { useCombatAnimations } from '../../hooks/useCombatAnimations';

const CombatScreen = () => {
    const { user, updateUser } = useAuth();
    const { theme } = useTheme();
    const { t } = useLanguage();

    const [combatMode, setCombatMode] = useState<string | null>(null);
    const [activeCombat, setActiveCombat] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [inventoryVisible, setInventoryVisible] = useState(false);
    const [populatedInventory, setPopulatedInventory] = useState<any[]>([]);
    const [playerTurn, setPlayerTurn] = useState(true);
    const [defending, setDefending] = useState(false);
    const [showDungeonSelection, setShowDungeonSelection] = useState(false);
    const [selectedDungeon, setSelectedDungeon] = useState<string | null>(null);
    const [activeDungeon, setActiveDungeon] = useState<any>(null);
    const [skillsVisible, setSkillsVisible] = useState(false);
    const [lastDamage, setLastDamage] = useState(0);

    const scrollViewRef = useRef<ScrollView>(null);

    // Usar el hook para la imagen del jugador
    const { avatarKey } = usePlayerAvatar(user?.avatar);

    // Usar hook para animaciones
    const {
        enemyShake,
        enemyOpacity,
        damageNumberOpacity,
        damageNumberY,
        playerTranslateX,
        playerScale,
        flashOpacity,
        flashColor,
        setFlashColor,
        playEnemyDamageAnimation,
        playEnemyDefeatAnimation,
        playBasicAttackAnimation,
        playSpecialAttackAnimation,
        playSkillAnimation,
        playPlayerHurtAnimation,
        playFlashAnimation
    } = useCombatAnimations();

    // Check for active dungeon on component mount
    useEffect(() => {
        const checkActiveDungeon = async () => {
            try {
                const data = await combatApi.getDungeons();
                const active = data.dungeons.find((d: any) => d.inProgress);
                if (active) {
                    setSelectedDungeon(active._id);
                    setActiveDungeon(active);
                }
            } catch (error) {
                console.error('Error checking active dungeon:', error);
            }
        };

        if (!activeCombat) {
            checkActiveDungeon();
        }
    }, [activeCombat]);

    // Mantener la referencia al usuario actualizada
    useEffect(() => {
        if (user?.avatar) {
            // El hook usePlayerAvatar ya maneja esto automáticamente
        }
    }, [user?.avatar]);

    const handleSelectMode = (mode: string) => {
        setCombatMode(mode);
        setActiveCombat(null);
        setLogs([]);
    };

    const handleStartAutoCombat = async () => {
        try {
            setLoading(true);
            const data = await combatApi.startAutoCombat();
            setActiveCombat(data);
            setLogs(data.combatLog || []);

            if (data.user) {
                await updateUser(data.user);
            }

            // Show result
            setTimeout(() => {
                let message = data.result;
                if (data.xpGained) {
                    message += `\n\n💰 +${data.goldGained} Gold\n⭐ +${data.xpGained} XP`;
                    if (data.tetranutaDropped) {
                        message += `\n\n⚒️ +1 Tetranuta`;
                    }
                    if (data.leveledUp) {
                        message += `\n\n🎊 LEVEL UP! Now level ${data.newLevel}!`;
                    }
                } else if (data.goldLost) {
                    message += `\n\n💸 Lost ${data.goldLost} gold`;
                }
                Alert.alert(data.result.includes('Victory') ? t.victory : t.defeat, message);
            }, 1000);
        } catch (error: any) {
            console.error(error);
            Alert.alert(t.error, error.response?.data?.message || t.failedToStartCombat);
        } finally {
            setLoading(false);
        }
    };

    const handleInitiateCombat = async () => {
        try {
            setLoading(true);
            let data;

            if (activeCombat?.dungeonInfo?.id) {
                data = await combatApi.continueDungeon(activeCombat.dungeonInfo.id);
            } else {
                data = await combatApi.initiateCombat();
            }
            console.log('🔍 API RESPONSE:', JSON.stringify(data, null, 2));
            setActiveCombat(data);
            setLogs(data.log || []);

            setPlayerTurn(true);
            setDefending(false);
            enemyOpacity.setValue(1);

            if (data.user) {
                await updateUser(data.user);
            }
        } catch (error: any) {
            console.error(error);
            Alert.alert(t.error, error.response?.data?.message || t.failedToStartCombat);
        } finally {
            setLoading(false);
        }
    };

    const handleDungeonSelected = async (dungeonId: string) => {
        try {
            setLoading(true);
            const data = await combatApi.startDungeon(dungeonId);

            setSelectedDungeon(dungeonId);
            setCombatMode('manual'); // Navigate to combat screen
            setActiveCombat(data);
            setLogs(data.log || []);
            setPlayerTurn(true);
            setDefending(false);
            enemyOpacity.setValue(1);
            setShowDungeonSelection(false);

            if (data.user) {
                await updateUser(data.user);
            }
        } catch (error: any) {
            console.error(error);
            Alert.alert(t.error || 'Error', error.response?.data?.message || 'Failed to enter dungeon');
        } finally {
            setLoading(false);
        }
    };

    const handleContinueDungeon = async () => {
        if (!selectedDungeon) return;

        try {
            setLoading(true);
            console.log('🔄 Continuing dungeon with ID:', selectedDungeon);
            const data = await combatApi.continueDungeon(selectedDungeon);

            console.log('✅ Continue dungeon response:', data);
            setCombatMode('manual'); // Set mode to show combat screen
            setActiveCombat(data);
            setLogs(data.log || []);
            setPlayerTurn(true);
            setDefending(false);
            enemyOpacity.setValue(1);

            if (data.user) {
                await updateUser(data.user);
            }
        } catch (error: any) {
            console.error('❌ Continue dungeon error:', error);
            Alert.alert(t.error || 'Error', error.response?.data?.message || 'Failed to continue dungeon');
        } finally {
            setLoading(false);
        }
    };

    const handleRest = async () => {
        try {
            setLoading(true);
            const data = await combatApi.rest();

            if (data.combat) {
                const updatedUser = { ...user, combat: data.combat };
                await updateUser(updatedUser);
            }

            Alert.alert(t.success || 'Success', data.message);
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || 'Failed to rest';
            Alert.alert(t.rest || 'Rest', msg);
        } finally {
            setLoading(false);
        }
    };

    const loadPopulatedInventory = async () => {
        try {
            const data = await inventoryApi.getInventory();
            const consumables = data.data.filter((item: any) => item.details?.type === 'consumable');
            setPopulatedInventory(consumables);
        } catch (error) {
            console.error('Failed to load inventory:', error);
        }
    };

    // Para manejar acciones, usa el avatarKey en lugar de user?.avatar
    const handleAction = async (action: string, param: string | null = null) => {
        if (!activeCombat || !playerTurn) return;

        try {
            setLoading(true);
            setPlayerTurn(false);

            // Trigger animation
            if (action === 'attack') {
                playBasicAttackAnimation();
            } else if (action === 'skill' && param) {
                playSkillAnimation(param, user?.class);
            } else if (action === 'use-item' && param) {
                // Animación para usar item
                playFlashAnimation('rgba(0, 255, 0, 0.3)', 200);
            } else if (action === 'defend') {
                // Animación para defender
                playFlashAnimation('rgba(0, 0, 255, 0.3)', 300);
            }

            const combatId = activeCombat.combatId || activeCombat._id;
            let data;

            // Preparar el payload según la acción
            if (action === 'skill' && param) {
                // Para habilidades: action='skill', itemId=null, options={skillId: param}
                data = await combatApi.performAction(combatId, 'skill', null as any, { skillId: param });
            } else if (action === 'use-item' && param) {
                // Para items: action='use-item', itemId=param, options={}
                data = await combatApi.performAction(combatId, 'use-item', param as any);
            } else {
                // Para attack, defend, etc.: action=action, itemId=null, options={}
                data = await combatApi.performAction(combatId, action, null as any);
            }

            setActiveCombat(data);
            setLogs(data.log || []);
            setDefending(data.defending || false);

            if (data.user) {
                await updateUser(data.user);
            }

            // Play animations based on action
            if ((action === 'attack' || action === 'skill') && data.log) {
                const recentLogs = data.log.slice(Math.max(0, data.log.length - 2));
                const playerLog = recentLogs.find((l: any) => l.actor === 'Player' && l.damage > 0);
                if (playerLog) {
                    playEnemyDamageAnimation(playerLog.damage);
                    setLastDamage(playerLog.damage);
                }
            }

            // Check if enemy attacked player
            if (data.log) {
                const enemyLog = data.log.find((l: any) =>
                    l.actor === activeCombat?.enemy?.name &&
                    l.damage > 0 &&
                    l.target === 'Player'
                );
                if (enemyLog) {
                    playPlayerHurtAnimation();
                }
            }

            // Check combat status
            if (data.status === 'victory') {
                playEnemyDefeatAnimation();

                setTimeout(() => {
                    let message = `🎉 VICTORY! 🎉\n\n💰 +${data.rewards?.goldGained || 0} Gold\n⭐ +${data.rewards?.xpGained || 0} XP`;

                    if (data.rewards?.tetranutaDropped) {
                        message += `\n\n⚒️ +1 Tetranuta`;
                    }

                    // Mensaje especial para dungeon
                    if (data.dungeonComplete) {
                        message += `\n\n🏰 DUNGEON COMPLETED!\n`;
                        message += `Total Rewards: ${data.dungeonRewards?.gold || 0} Gold, ${data.dungeonRewards?.xp || 0} XP`;
                    } else if (data.nextEnemy) {
                        message += `\n\n➡️ Next enemy: ${data.nextEnemy.name}`;
                    }

                    if (data.leveledUp) {
                        message += `\n\n🎊 LEVEL UP! Now level ${data.newLevel}!`;
                    }

                    Alert.alert(t.victory || 'Victory', message, [
                        {
                            text: 'OK',
                            onPress: () => {
                                if (data.dungeonComplete) {
                                    // Volver al menú principal si se completó el dungeon
                                    setCombatMode(null);
                                    setActiveCombat(null);
                                    setLogs([]);
                                    setSelectedDungeon(null);
                                    setActiveDungeon(null);
                                } else if (data.nextEnemy) {
                                    // Continuar con el siguiente enemigo
                                    setActiveCombat(data);
                                    setLogs(data.log || []);
                                    setPlayerTurn(true);
                                    enemyOpacity.setValue(1);
                                }
                            }
                        }
                    ]);

                }, 500);
            } else if (data.status === 'defeat') {
                setTimeout(() => {
                    Alert.alert(t.defeat || 'Defeat', `You were defeated...\n\n💸 Lost ${data.goldLost || 0} gold`);
                    setCombatMode(null);
                    setActiveCombat(null);
                    setLogs([]);
                    setSelectedDungeon(null);
                    setActiveDungeon(null);
                }, 500);
            } else {
                // Combat continues - backend already processed enemy turn
                setTimeout(() => {
                    setPlayerTurn(true);
                }, 1000);
            }

            setInventoryVisible(false);
            setSkillsVisible(false);
        } catch (error: any) {
            console.error('Error in handleAction:', error);
            Alert.alert(
                t.error || 'Error',
                error.response?.data?.message || error.message || t.failedToPerformAction || 'Failed to perform action'
            );
            setPlayerTurn(true); // Volver al turno del jugador en caso de error
        } finally {
            setLoading(false);
        }
    };

    // Auto Combat Screen
    if (combatMode === 'auto') {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: theme.textLight }]}>⚡ {t.autoCombat || 'Auto Combat'}</Text>
                </View>

                <View style={styles.statsContainer}>
                    <PixelCard style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Text style={[styles.statLabel, { color: theme.text }]}>PLAYER {t.hp || 'HP'}</Text>
                        <Text style={[styles.statValue, { color: theme.success }]}>
                            {activeCombat?.finalPlayerHP || user?.combat?.currentHP}/{user?.combat?.maxHP}
                        </Text>
                    </PixelCard>

                    {activeCombat && (
                        <PixelCard style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Text style={[styles.statLabel, { color: theme.text }]}>{activeCombat.enemy.name.toUpperCase()}</Text>
                            <Text style={[styles.statValue, { color: theme.danger }]}>
                                {activeCombat.finalEnemyHP}/{activeCombat.enemy.maxHP}
                            </Text>
                        </PixelCard>
                    )}
                </View>

                <View style={[styles.logContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={styles.logContent}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    >
                        {logs.length === 0 ? (
                            <Text style={[styles.placeholderText, { color: theme.text }]}>{t.pressToStart || 'Press FIGHT to start combat'}</Text>
                        ) : (
                            logs.map((log, index) => (
                                <Text key={index} style={[styles.logText, { color: theme.text }]}>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        color: log.actor === 'Player' ? theme.success :
                                            log.actor === 'System' ? theme.warning : theme.danger
                                    }}>
                                        {log.actor}:
                                    </Text>
                                    {' '}{log.message || `${log.action} ${log.damage ? `(${log.damage} dmg)` : ''}`}
                                </Text>
                            ))
                        )}
                    </ScrollView>
                </View>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: theme.danger, borderColor: theme.border }]}
                        onPress={handleStartAutoCombat}
                        disabled={loading}
                    >
                        <Text style={[styles.actionText, { color: theme.textLight }]}>⚔️ {t.fight || 'FIGHT'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.smallButton, { backgroundColor: theme.secondary, borderColor: theme.border }]}
                        onPress={() => setCombatMode(null)}
                    >
                        <Text style={[styles.smallButtonText, { color: theme.textLight }]}>← {t.backToMenu || 'Back to Menu'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Renderizado condicional
    if (!combatMode && !showDungeonSelection) {
        return (
            <ModeSelectionScreen
                onSelectMode={handleSelectMode}
                onSelectDungeon={() => setShowDungeonSelection(true)}
                onContinueDungeon={handleContinueDungeon}
                onRest={handleRest}
                hasActiveDungeon={!!selectedDungeon}
                loading={loading}
            />
        );
    }

    if (showDungeonSelection) {
        return (
            <DungeonSelectionScreen
                onDungeonSelected={handleDungeonSelected}
                onBack={() => setShowDungeonSelection(false)}
            />
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Screen Flash Overlay */}
            <Animated.View
                pointerEvents="none"
                style={[
                    StyleSheet.absoluteFill,
                    {
                        backgroundColor: flashColor,
                        opacity: flashOpacity,
                        zIndex: 999,
                    },
                ]}
            />

            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.textLight }]}>
                    {activeCombat?.dungeonInfo ? '🏰 DUNGEON' : '🎮 MANUAL COMBAT'}
                </Text>
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: theme.secondary }]}
                    onPress={() => {
                        setCombatMode(null);
                        setActiveCombat(null);
                        setLogs([]);
                    }}
                >
                    <Text style={[styles.backButtonText, { color: theme.textLight }]}>← Menu</Text>
                </TouchableOpacity>
            </View>

            {/* Dungeon Info */}
            {activeCombat?.dungeonInfo && (
                <View style={[styles.dungeonInfo, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.dungeonName, { color: theme.text }]}>
                        🏰 {activeCombat.dungeonInfo.name}
                    </Text>
                    <View style={styles.dungeonProgress}>
                        <View style={styles.progressBarBg}>
                            <View
                                style={[
                                    styles.progressBarFill,
                                    {
                                        backgroundColor: theme.primary,
                                        width: `${(activeCombat.dungeonInfo.currentEnemy / activeCombat.dungeonInfo.totalEnemies) * 100}%`
                                    }
                                ]}
                            />
                        </View>
                        <Text style={[styles.progressText, { color: theme.secondary }]}>
                            Enemy {activeCombat.dungeonInfo.currentEnemy + 1} of {activeCombat.dungeonInfo.totalEnemies}
                        </Text>
                    </View>
                </View>
            )}

            {/* Combat Area usando el componente separado */}
            <CombatArea
                user={user}
                avatarKey={avatarKey}
                activeCombat={activeCombat}
                enemyShake={enemyShake}
                enemyOpacity={enemyOpacity}
                damageNumberOpacity={damageNumberOpacity}
                damageNumberY={damageNumberY}
                lastDamage={lastDamage}
                playerTranslateX={playerTranslateX}
                playerScale={playerScale}
            />

            {/* Turn Indicator */}
            {activeCombat && activeCombat.status === 'active' && (
                <View style={[styles.turnIndicator, { backgroundColor: playerTurn ? theme.success : theme.danger }]}>
                    <Text style={[styles.turnText, { color: theme.textLight }]}>
                        {playerTurn ? `⚔️ ${t.yourTurn || 'YOUR TURN'}` : `🛡️ ${t.enemyTurnLabel || 'ENEMY TURN'}`}
                    </Text>
                </View>
            )}

            {/* Stats usando componente separado */}
            <CombatStats
                user={user}
                activeCombat={activeCombat}
                defending={defending}
                theme={theme}
            />


            {/* Action Buttons usando componente separado */}
            <ActionButtons
                activeCombat={activeCombat}
                playerTurn={playerTurn}
                loading={loading}
                combatMode={combatMode}
                onInitiateCombat={handleInitiateCombat}
                onAttack={() => handleAction('attack')}
                onDefend={() => handleAction('defend')}
                onOpenSkills={() => setSkillsVisible(true)}
                onOpenInventory={() => {
                    loadPopulatedInventory();
                    setInventoryVisible(true);
                }}
                onBackToMenu={() => {
                    setCombatMode(null);
                    setActiveCombat(null);
                    setLogs([]);
                }}
                theme={theme}
                t={t}
            />

            {/* Modales */}
            <InventoryModal
                visible={inventoryVisible}
                populatedInventory={populatedInventory}
                theme={theme}
                t={t}
                onUseItem={(itemId) => handleAction('use-item', itemId)}
                onClose={() => setInventoryVisible(false)}
            />

            <SkillsModal
                visible={skillsVisible}
                user={user}
                theme={theme}
                t={t}
                onUseSkill={(skillId) => handleAction('skill', skillId)}
                onClose={() => setSkillsVisible(false)}
            />
        </View>
    );
};

// Estilos completos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
        flex: 1,
        textAlign: 'center',
    },
    backButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    backButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    dungeonInfo: {
        padding: spacing.sm,
        marginBottom: spacing.md,
        borderRadius: 8,
        borderWidth: 2,
    },
    dungeonName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    dungeonProgress: {
        alignItems: 'center',
    },
    progressBarBg: {
        width: '100%',
        height: 10,
        backgroundColor: '#333',
        borderRadius: 5,
        marginBottom: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    progressText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    turnIndicator: {
        padding: spacing.sm,
        alignItems: 'center',
        marginBottom: spacing.md,
        borderRadius: 4,
    },
    turnText: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    // Estilos adicionales para modo auto
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
        marginBottom: spacing.md,
        padding: spacing.sm,
        minHeight: 150,
    },
    logContent: {
        paddingBottom: spacing.md,
    },
    logText: {
        fontSize: 13,
        marginBottom: 4,
        fontFamily: 'monospace',
    },
    placeholderText: {
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
    },
    actionsContainer: {
        marginBottom: spacing.md,
    },
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

export default CombatScreen;