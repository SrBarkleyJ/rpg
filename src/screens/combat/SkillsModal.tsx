import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
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

const CLASS_SKILLS: Record<string, any[]> = {
    warrior: [
        { id: 'bash', name: 'Bash', cost: 10, desc: 'Heavy strike (1.5x Dmg)' },
        { id: 'berserk', name: 'Berserk', cost: 20, desc: 'Buff STR (3 turns)' },
        { id: 'execute', name: 'Execute', cost: 30, desc: '2.5x Dmg if enemy < 30% HP' },
        { id: 'iron_skin', name: 'Iron Skin', cost: 15, desc: 'Reduce dmg 50% (2 turns)' }
    ],
    mage: [
        { id: 'fireball', name: 'Fireball', cost: 15, desc: 'Fire dmg (1.5x)' },
        { id: 'ice_shard', name: 'Ice Shard', cost: 20, desc: 'Ice dmg (1.2x)' },
        { id: 'thunder_strike', name: 'Thunder Strike', cost: 35, desc: 'High dmg (2.0x)' },
        { id: 'heal', name: 'Heal', cost: 25, desc: 'Restore HP' }
    ],
    rogue: [
        { id: 'double_stab', name: 'Double Stab', cost: 10, desc: '2 hits (0.8x each)' },
        { id: 'poison_tip', name: 'Poison Tip', cost: 15, desc: 'Apply Poison' },
        { id: 'evasion', name: 'Evasion', cost: 20, desc: 'Dodge next attack' },
        { id: 'assassinate', name: 'Assassinate', cost: 40, desc: 'High Crit chance' }
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
                <PixelCard style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.modalTitle, { color: theme.text }]}>✨ SKILLS</Text>
                    <Text style={{ color: theme.secondary, textAlign: 'center', marginBottom: 10, fontSize: 20 }}>
                        Mana: {user?.combat?.currentMana || 0}/{user?.combat?.maxMana || 0}
                    </Text>

                    <FlatList
                        data={userSkills}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.invItem, { borderColor: theme.border, backgroundColor: theme.background }]}
                                onPress={() => onUseSkill(item.id)}
                                disabled={(user?.combat?.currentMana || 0) < item.cost}
                            >
                                <View style={styles.invInfo}>
                                    <Text style={[
                                        styles.invName, 
                                        { color: (user?.combat?.currentMana || 0) >= item.cost ? theme.text : '#666' }
                                    ]}>
                                        {item.name}
                                    </Text>
                                    <Text style={[styles.invDesc, { color: theme.text, fontSize: 10 }]}>{item.desc}</Text>
                                </View>
                                <Text style={[styles.useText, { color: '#3b82f6' }]}>{item.cost} MP</Text>
                            </TouchableOpacity>
                        )}
                    />

                    <TouchableOpacity
                        style={[styles.closeButton, { backgroundColor: theme.danger, borderColor: theme.border }]}
                        onPress={onClose}
                    >
                        <Text style={[styles.closeButtonText, { color: theme.textLight }]}>{t.cancel || 'CANCEL'}</Text>
                    </TouchableOpacity>
                </PixelCard>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        padding: spacing.lg,
    },
    modalContent: {
        maxHeight: '70%',
        padding: spacing.md,
        borderWidth: 2,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    invItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.sm,
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: spacing.sm,
    },
    invInfo: {
        flex: 1,
    },
    invName: {
        fontWeight: 'bold',
        fontSize: 22,
        marginBottom: 4,
    },
    invDesc: {
        fontSize: 20,
        opacity: 0.8,
        marginBottom: 4,
    },
    useText: {
        fontWeight: 'bold',
        fontSize: 21,
    },
    closeButton: {
        marginTop: spacing.md,
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