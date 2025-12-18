import { useState, useEffect, useRef } from 'react';
import { AppState, Alert, ScrollView } from 'react-native';
import combatApi from '../api/combatApi';
import inventoryApi from '../api/inventoryApi';
import { useAuth } from './useAuth';
import { useLanguage } from '../context/LanguageContext';
import { useCombatAnimations } from './useCombatAnimations';
import { getSkillAnimation, SkillAnimationConfig } from '../config/skillAnimations';
import { hapticImpactHeavy, hapticImpactMedium } from '../utils/haptics';

export const useCombatLogic = () => {
    const { user, updateUser } = useAuth();
    const { t } = useLanguage();
    const animations = useCombatAnimations();

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
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [resultType, setResultType] = useState<'victory' | 'defeat'>('victory');
    const [resultData, setResultData] = useState<any>(null);

    const appState = useRef(AppState.currentState);
    const scrollViewRef = useRef<ScrollView>(null);
    const processingAction = useRef(false);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

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

            setTimeout(() => {
                const isVictory = data.result.includes('Victory');
                setResultType(isVictory ? 'victory' : 'defeat');
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
            animations.enemyOpacity.setValue(1);

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
            setCombatMode('manual');
            setActiveCombat(data);
            setLogs(data.log || []);
            setPlayerTurn(true);
            setDefending(false);
            animations.enemyOpacity.setValue(1);
            setShowDungeonSelection(false);

            if (data.user) {
                await updateUser(data.user);
            }
        } catch (error: any) {
            console.error(error);
            Alert.alert(t.error || 'Error', error.response?.data?.message || t.failedToEnterDungeon);
        } finally {
            setLoading(false);
        }
    };

    const handleContinueDungeon = async () => {
        if (!selectedDungeon) return;
        try {
            setLoading(true);
            const data = await combatApi.continueDungeon(selectedDungeon);
            setCombatMode('manual');
            setActiveCombat(data);
            setLogs(data.log || []);
            setPlayerTurn(true);
            setDefending(false);
            animations.enemyOpacity.setValue(1);

            if (data.user) {
                await updateUser(data.user);
            }
        } catch (error: any) {
            console.error('❌ Continue dungeon error:', error);
            Alert.alert(t.error || 'Error', error.response?.data?.message || t.failedToContinueDungeon);
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
            const msg = error.response?.data?.message || t.failedToRest;
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

    const handleAction = async (action: string, param: string | null = null) => {
        if (!activeCombat || !playerTurn || processingAction.current) return;
        processingAction.current = true;

        try {
            setLoading(true);
            setPlayerTurn(false);

            if (action === 'attack') {
                hapticImpactHeavy();
                animations.playBasicAttackAnimation();
            } else if (action === 'skill' && param) {
                const skillAnim = getSkillAnimation(param);
                if (skillAnim) {
                    setActiveSkillAnimation(skillAnim);
                }
                animations.playSkillAnimation(param, user?.class);
                hapticImpactMedium();
            } else if (action === 'use-item' && param) {
                animations.playFlashAnimation('rgba(0, 255, 0, 0.3)', 200);
            } else if (action === 'defend') {
                animations.playFlashAnimation('rgba(0, 0, 255, 0.3)', 300);
            }

            const combatId = activeCombat.combatId || activeCombat._id;
            let data;

            if (action === 'skill' && param) {
                data = await combatApi.performAction(combatId, 'skill', null as any, { skillId: param });
            } else if (action === 'use-item' && param) {
                data = await combatApi.performAction(combatId, 'use-item', param as any);
            } else {
                data = await combatApi.performAction(combatId, action, null as any);
            }

            if (data.user) {
                await updateUser(data.user);
            }

            if ((action === 'attack' || action === 'skill') && data.log) {
                const recentLogs = data.log.slice(Math.max(0, data.log.length - 2));
                const playerLog = recentLogs.find((l: any) => l.actor === 'Player' && l.damage > 0);
                if (playerLog) {
                    animations.playEnemyDamageAnimation(playerLog.damage);
                    setLastDamage(playerLog.damage);
                }
            }

            if (data.log) {
                const enemyLog = data.log.find((l: any) =>
                    l.actor === activeCombat?.enemy?.name &&
                    l.damage > 0 &&
                    l.target === 'Player'
                );
                if (enemyLog) {
                    animations.playPlayerHurtAnimation();
                }
            }

            if (data.status === 'victory') {
                animations.playEnemyDefeatAnimation();
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
            processingAction.current = false;
        }
    };

    const resetCombatState = () => {
        setCombatMode(null);
        setActiveCombat(null);
        setLogs([]);
        setSelectedDungeon(null);
        setActiveDungeon(null);
        setResultModalVisible(false);
    };

    return {
        combatMode, setCombatMode,
        activeCombat, setActiveCombat,
        logs, setLogs,
        loading,
        inventoryVisible, setInventoryVisible,
        populatedInventory,
        playerTurn,
        defending,
        showDungeonSelection, setShowDungeonSelection,
        selectedDungeon,
        skillsVisible, setSkillsVisible,
        lastDamage,
        activeSkillAnimation, setActiveSkillAnimation,
        resultModalVisible, setResultModalVisible,
        resultType,
        resultData,
        scrollViewRef,
        handleSelectMode,
        handleStartAutoCombat,
        handleInitiateCombat,
        handleDungeonSelected,
        handleContinueDungeon,
        handleRest,
        loadPopulatedInventory,
        handleAction,
        resetCombatState,
        animations,
        user,
        t
    };
};
