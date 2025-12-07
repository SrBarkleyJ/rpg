import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import PixelCard from '../../components/UI/Card';
import { spacing } from '../../theme/spacing';

interface SkillsModalProps {
    visible: boolean;
    user: any;
    theme: any;
    t: any;
    onUseSkill: (skillId: string) => void;
    onClose: () => void;
}

// 18 Skills (6 per class) - synced with animation-test
// 18 Skills (6 per class) - synced with animation-test
const CLASS_SKILLS: Record<string, any[]> = {
    warrior: [
        { id: 'bash', name: 'Bash', cost: 10, descKey: 'Bash_desc' },
        { id: 'berserk', name: 'Berserk', cost: 20, descKey: 'Berserk_desc' },
        { id: 'execute', name: 'Execute_skill', cost: 30, descKey: 'Execute_skill_desc' },
        { id: 'ground_slam', name: 'Ground Slam', cost: 25, descKey: 'Ground Slam_desc' },
        { id: 'war_cry', name: 'War Cry', cost: 15, descKey: 'War Cry_desc' },
        { id: 'charge', name: 'Charge', cost: 12, descKey: 'Charge_desc' }
    ],
    mage: [
        { id: 'fireball', name: 'Fireball_skill', cost: 15, descKey: 'Fireball_skill_desc' },
        { id: 'ice_shard', name: 'Ice Shard', cost: 12, descKey: 'Ice Shard_desc' },
        { id: 'arcane_bolt', name: 'Arcane Bolt', cost: 10, descKey: 'Arcane Bolt_desc' },
        { id: 'meteor', name: 'Meteor', cost: 40, descKey: 'Meteor_desc' },
        { id: 'chain_lightning', name: 'Chain Lightning', cost: 25, descKey: 'Chain Lightning_desc' },
        { id: 'thunder_strike', name: 'Thunder Strike', cost: 35, descKey: 'Thunder Strike_desc' }
    ],
    rogue: [
        { id: 'double_stab', name: 'Double Stab', cost: 10, descKey: 'Double Stab_desc' },
        { id: 'poison_tip', name: 'Poison Tip', cost: 15, descKey: 'Poison Tip_desc' },
        { id: 'backstab', name: 'Backstab', cost: 18, descKey: 'Backstab_desc' },
        { id: 'assassinate', name: 'Assassinate', cost: 40, descKey: 'Assassinate_desc' },
        { id: 'shadow_strike', name: 'Shadow Strike', cost: 20, descKey: 'Shadow Strike_desc' },
        { id: 'blade_dance', name: 'Blade Dance', cost: 30, descKey: 'Blade Dance_desc' }
    ]
};

const SkillsModal: React.FC<SkillsModalProps> = ({
    visible,
    user,
    theme,
    t,
    onUseSkill,
    onClose,
}) => {
    const userSkills = CLASS_SKILLS[user?.class as keyof typeof CLASS_SKILLS] || [];

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                {/* Empty top area for combat view */}
                <TouchableOpacity
                    style={styles.topArea}
                    activeOpacity={1}
                    onPress={onClose}
                />

                {/* Bottom Sheet */}
                <PixelCard style={[styles.bottomSheet, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={styles.header}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>{t.skillsTitleIcon}</Text>
                        <Text style={{ color: theme.secondary, fontSize: 16, fontWeight: 'bold' }}>
                            ⚡ {user?.combat?.currentMana || 0}/{user?.combat?.maxMana || 0}
                        </Text>
                    </View>

                    {/* Scrollable 2-Column Grid for 6 skills */}
                    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                        <View style={styles.gridContainer}>
                            {userSkills.map((item, index) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.gridItem,
                                        {
                                            borderColor: theme.border,
                                            backgroundColor: theme.background,
                                            marginRight: index % 2 === 0 ? spacing.sm : 0
                                        }
                                    ]}
                                    onPress={() => onUseSkill(item.id)}
                                    disabled={(user?.combat?.currentMana || 0) < item.cost}
                                >
                                    <Text style={[
                                        styles.skillName,
                                        { color: (user?.combat?.currentMana || 0) >= item.cost ? theme.text : '#666' }
                                    ]}>
                                        {t[item.name] || item.name}
                                    </Text>
                                    <Text style={[styles.skillDesc, { color: theme.text }]}>
                                        {t[item.descKey] || item.desc}
                                    </Text>
                                    <Text style={[styles.skillCost, { color: '#3b82f6' }]}>
                                        {item.cost} MP
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.closeButton, { backgroundColor: theme.danger, borderColor: theme.border }]}
                        onPress={onClose}
                    >
                        <Text style={[styles.closeButtonText, { color: theme.textLight }]}>{t.cancel}</Text>
                    </TouchableOpacity>
                </PixelCard>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
    },
    topArea: {
        flex: 1,
    },
    bottomSheet: {
        maxHeight: '60%', // Increased for 6 skills
        padding: spacing.md,
        borderWidth: 2,
        borderBottomWidth: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollContainer: {
        maxHeight: 280, // Limit scroll height
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: spacing.sm,
    },
    gridItem: {
        width: '48%',
        padding: spacing.sm,
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: spacing.sm,
        minHeight: 70,
    },
    skillName: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 2,
    },
    skillDesc: {
        fontSize: 10,
        opacity: 0.8,
        marginBottom: 2,
    },
    skillCost: {
        fontWeight: 'bold',
        fontSize: 12,
        marginTop: 2,
    },
    closeButton: {
        marginTop: spacing.sm,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 2,
    },
    closeButtonText: {
        fontWeight: 'bold',
    },
});

export default SkillsModal;