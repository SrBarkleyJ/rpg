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
    Easing,
    AppState
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
import CombatResultModal from '../../components/modals/CombatResultModal';

// Importar hooks
import { usePlayerAvatar } from '../../hooks/usePlayerAvatar';
import { useCombatAnimations } from '../../hooks/useCombatAnimations';

// Importar componentes de animación
import SpriteAnimation from '../../components/combat/SpriteAnimation';
import FrameAnimation from '../../components/combat/FrameAnimation';
import { getSkillAnimation, SkillAnimationConfig } from '../../config/skillAnimations';

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
    const [activeSkillAnimation, setActiveSkillAnimation] = useState<SkillAnimationConfig | null>(null);
    const appState = useRef(AppState.currentState);

    // AppState Listener for lifecycle management
    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                console.log('App has come to the foreground!');
                // Potential logic to resync combat state if needed
            } else if (nextAppState.match(/inactive|background/)) {
                console.log('App went to background');
                // Potential logic to pause heavy animations if strictly necessary
            }

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    // Result Modal State
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [resultType, setResultType] = useState<'victory' | 'defeat'>('victory');
    const [resultData, setResultData] = useState<any>(null);

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

            // Show result using Modal
            setTimeout(() => {
                const isVictory = data.result.includes('Victory');
                setResultType(isVictory ? 'victory' : 'defeat');

                // Map auto combat data to modal expected format
                const modalData = {
                    ...data,
                    rewards: {
                        goldGained: data.goldGained,
                        xpGained: data.xpGained,
                        tetranutaDropped: data.tetranutaDropped
                    },
                    status: isVictory ? 'victory' : 'defeat'
                };

                setResultData(modalData);
                setResultModalVisible(true);
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
            const data = await combatApi.continueDungeon(selectedDungeon);
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

            // Trigger animations
            if (action === 'attack') {
                playBasicAttackAnimation();
            } else if (action === 'skill' && param) {
                // Activar animación frame-by-frame para la skill
                const skillAnim = getSkillAnimation(param);
                if (skillAnim) {
                    setActiveSkillAnimation(skillAnim);
                }
                playSkillAnimation(param, user?.class);
            } else if (action === 'use-item' && param) {
                playFlashAnimation('rgba(0, 255, 0, 0.3)', 200);
            } else if (action === 'defend') {
                playFlashAnimation('rgba(0, 0, 255, 0.3)', 300);
            }

            const combatId = activeCombat.combatId || activeCombat._id;
            let data;

            // Preparar el payload según la acción
            if (action === 'skill' && param) {
                data = await combatApi.performAction(combatId, 'skill', null as any, { skillId: param });
            } else if (action === 'use-item' && param) {
                data = await combatApi.performAction(combatId, 'use-item', param as any);
            } else {
                data = await combatApi.performAction(combatId, action, null as any);
            }

            // Wait to check status before updating state to avoid premature enemy switch
            // setActiveCombat(data);  <<-- REMOVED FROM HERE
            // setLogs(data.log || []); <<-- REMOVED FROM HERE
            // setDefending(data.defending || false); <<-- REMOVED FROM HERE

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

                // Delay to allow animation to play and user to register the kill
                setTimeout(() => {
                    setResultType('victory');
                    setResultData(data);
                    setResultModalVisible(true);
                }, 500);

            } else if (data.status === 'defeat') {
                setTimeout(() => {
                    setResultType('defeat');
                    setResultData(data);
                    setResultModalVisible(true);
                }, 500);

            } else {
                // Regular turn update
                setActiveCombat(data);
                setLogs(data.log || []);
                setDefending(data.defending || false);

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
            setPlayerTurn(true);
        } finally {
            setLoading(false);
        }
    };

    // Auto Combat Screen
    if (combatMode === 'auto') {
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

                <View style={[styles.logContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={styles.logContent}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    >
                        {logs.length === 0 ? (
                            <Text style={[styles.placeholderText, { color: theme.text }]}>{t.pressToStart}</Text>
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
                        <Text style={[styles.actionText, { color: theme.textLight }]}>{t.fightIcon}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.smallButton, { backgroundColor: theme.secondary, borderColor: theme.border }]}
                        onPress={() => setCombatMode(null)}
                    >
                        <Text style={[styles.smallButtonText, { color: theme.textLight }]}>← {t.backToMenu}</Text>
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
                    {activeCombat?.dungeonInfo ? `🏰 ${t.dungeon}` : `🎮 ${t.manualCombat}`}
                </Text>
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: theme.secondary }]}
                    onPress={() => {
                        setCombatMode(null);
                        setActiveCombat(null);
                        setLogs([]);
                    }}
                >
                    <Text style={[styles.backButtonText, { color: theme.textLight }]}>{t.menuArrow}</Text>
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
                            {t.enemy} {activeCombat.dungeonInfo.currentEnemy + 1} {t.of} {activeCombat.dungeonInfo.totalEnemies}
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
                skillAnimation={
                    activeSkillAnimation ? (
                        <FrameAnimation
                            frames={activeSkillAnimation.frames}
                            fps={activeSkillAnimation.fps}
                            size={activeSkillAnimation.size}
                            tintColor={activeSkillAnimation.tintColor}
                            travelling={activeSkillAnimation.travelling}
                            rotation={activeSkillAnimation.rotation}
                            loop={false}
                            onComplete={() => setActiveSkillAnimation(null)}
                        />
                    ) : undefined
                }
            />

            {/* Turn Indicator */}
            {activeCombat && activeCombat.status === 'active' && (
                <View style={[styles.turnIndicator, { backgroundColor: playerTurn ? theme.success : theme.danger }]}>
                    <Text style={[styles.turnText, { color: theme.textLight }]}>
                        {playerTurn ? `⚔️ ${t.yourTurn}` : `🛡️ ${t.enemyTurnLabel}`}
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

            <CombatResultModal
                visible={resultModalVisible}
                type={resultType}
                data={resultData}
                onClose={() => {
                    setResultModalVisible(false);
                    if (resultData) {
                        if (resultData.nextEnemy) {
                            // Continue dungeon
                            setActiveCombat(resultData);
                            setLogs(resultData.log || []);
                            setPlayerTurn(true);
                            enemyOpacity.setValue(1);
                        } else {
                            // End combat (Victory, Defeat, or Dungeon Complete)
                            setCombatMode(null);
                            setActiveCombat(null);
                            setLogs([]);
                            setSelectedDungeon(null);
                            setActiveDungeon(null);
                        }
                    }
                }}
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