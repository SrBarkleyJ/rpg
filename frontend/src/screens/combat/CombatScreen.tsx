import React from 'react';
import {
    View,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/spacing';

// Custom Hooks
import { useCombatLogic } from '../../hooks/useCombatLogic';
import { usePlayerAvatar } from '../../hooks/usePlayerAvatar';

// Components
import DungeonSelectionScreen from './DungeonSelectionScreen';
import ModeSelectionScreen from './ModeSelectionScreen';
import CombatArea from './CombatArea';
import CombatStats from './CombatStats';
import ActionButtons from './ActionButtons';
import InventoryModal from './InventoryModal';
import SkillsModal from './SkillsModal';
import CombatResultModal from '../../components/modals/CombatResultModal';
import FrameAnimation from '../../components/combat/FrameAnimation';

// Refactored Components
import CombatHeader from '../../components/combat/CombatHeader';
import DungeonInfoDisplay from '../../components/combat/DungeonInfoDisplay';
import AutoCombatView from '../../components/combat/AutoCombatView';

const CombatScreen = () => {
    const { theme } = useTheme();
    const combat = useCombatLogic();
    const { avatarKey } = usePlayerAvatar(combat.user?.avatar || 'img1');

    const { t, animations } = combat;

    // Renderized Logic
    if (combat.combatMode === 'auto') {
        return (
            <AutoCombatView
                activeCombat={combat.activeCombat}
                user={combat.user}
                logs={combat.logs}
                loading={combat.loading}
                onStartAutoCombat={combat.handleStartAutoCombat}
                onBack={() => combat.setCombatMode(null)}
                scrollViewRef={combat.scrollViewRef}
                theme={theme}
                t={t}
            />
        );
    }

    if (!combat.combatMode && !combat.showDungeonSelection) {
        return (
            <ModeSelectionScreen
                onSelectMode={combat.handleSelectMode}
                onSelectDungeon={() => combat.setShowDungeonSelection(true)}
                onContinueDungeon={combat.handleContinueDungeon}
                onRest={combat.handleRest}
                hasActiveDungeon={!!combat.selectedDungeon}
                loading={combat.loading}
            />
        );
    }

    if (combat.showDungeonSelection) {
        return (
            <DungeonSelectionScreen
                onDungeonSelected={combat.handleDungeonSelected}
                onBack={() => combat.setShowDungeonSelection(false)}
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
                        backgroundColor: animations.flashColor,
                        opacity: animations.flashOpacity,
                        zIndex: 999,
                    },
                ]}
            />

            {/* Header */}
            <CombatHeader
                title={combat.activeCombat?.dungeonInfo ? `🏰 ${t.dungeon}` : `🎮 ${t.manualCombat}`}
                backText={t.menuArrow}
                onBack={() => combat.resetCombatState()}
                theme={theme}
            />

            {/* Content Container */}
            <View style={{ flex: 1, gap: spacing.sm, marginTop: height * 0.01 }}>

                {/* Dungeon Info */}
                {combat.activeCombat?.dungeonInfo && (
                    <DungeonInfoDisplay
                        dungeonInfo={combat.activeCombat.dungeonInfo}
                        theme={theme}
                    />
                )}

                {/* Combat Area */}
                <View style={{ flex: 3, justifyContent: 'center', paddingVertical: 2 }}>
                    <CombatArea
                        user={combat.user}
                        avatarKey={avatarKey}
                        activeCombat={combat.activeCombat}
                        enemyShake={animations.enemyShake}
                        enemyOpacity={animations.enemyOpacity}
                        damageNumberOpacity={animations.damageNumberOpacity}
                        damageNumberY={animations.damageNumberY}
                        lastDamage={combat.lastDamage}
                        playerTranslateX={animations.playerTranslateX}
                        playerScale={animations.playerScale}
                        skillAnimation={
                            combat.activeSkillAnimation ? (
                                <FrameAnimation
                                    frames={combat.activeSkillAnimation.frames}
                                    fps={combat.activeSkillAnimation.fps}
                                    size={combat.activeSkillAnimation.size}
                                    tintColor={combat.activeSkillAnimation.tintColor}
                                    travelling={combat.activeSkillAnimation.travelling}
                                    rotation={combat.activeSkillAnimation.rotation}
                                    loop={false}
                                    onComplete={() => combat.setActiveSkillAnimation(null)}
                                />
                            ) : undefined
                        }
                        style={{ flex: 1 }}
                    />
                </View>

                {/* Stats */}
                <View style={{ flex: 2, justifyContent: 'center', paddingTop: 18 }}>
                    <CombatStats
                        user={combat.user}
                        activeCombat={combat.activeCombat}
                        defending={combat.defending}
                        theme={theme}
                    />
                </View>

                {/* Action Buttons */}
                <View style={{ flex: 4, paddingTop: 18 }}>
                    <ActionButtons
                        activeCombat={combat.activeCombat}
                        playerTurn={combat.playerTurn}
                        loading={combat.loading}
                        combatMode={combat.combatMode}
                        onInitiateCombat={combat.handleInitiateCombat}
                        onAttack={() => combat.handleAction('attack')}
                        onDefend={() => combat.handleAction('defend')}
                        onOpenSkills={() => combat.setSkillsVisible(true)}
                        onOpenInventory={() => {
                            combat.loadPopulatedInventory();
                            combat.setInventoryVisible(true);
                        }}
                        onBackToMenu={() => combat.resetCombatState()}
                        theme={theme}
                        t={t}
                    />
                </View>
            </View>

            <CombatResultModal
                visible={combat.resultModalVisible}
                type={combat.resultType}
                data={combat.resultData}
                onClose={() => {
                    if (combat.resultData?.nextEnemy) {
                        combat.setActiveCombat(combat.resultData);
                        combat.setLogs(combat.resultData.log || []);
                        animations.enemyOpacity.setValue(1);
                        combat.setResultModalVisible(false);
                    } else {
                        combat.resetCombatState();
                    }
                }}
            />

            <InventoryModal
                visible={combat.inventoryVisible}
                populatedInventory={combat.populatedInventory}
                theme={theme}
                t={t}
                onUseItem={(itemId) => combat.handleAction('use-item', itemId)}
                onClose={() => combat.setInventoryVisible(false)}
            />

            <SkillsModal
                visible={combat.skillsVisible}
                user={combat.user}
                theme={theme}
                t={t}
                onUseSkill={(skillId) => combat.handleAction('skill', skillId)}
                onClose={() => combat.setSkillsVisible(false)}
            />
        </View>
    );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.md,
        paddingBottom: 90,
    },
});

export default CombatScreen;
