import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import PixelCard from '../UI/Card';

interface SlotOption {
    key: string;
    label: string;
    icon: string;
}

interface SlotSelectorProps {
    visible: boolean;
    item: any;
    onSelectSlot: (slot: string) => void;
    onCancel: () => void;
}

/**
 * Modal component for selecting equipment slot
 * Shows available slots for the selected item
 */
const SlotSelector: React.FC<SlotSelectorProps> = ({ visible, item, onSelectSlot, onCancel }) => {
    const { theme } = useTheme();
    const { t } = useLanguage();

    if (!item?.details) return null;

    const getAvailableSlots = (): SlotOption[] => {
        const itemType = item.details.type?.toLowerCase();
        const itemSlot = item.details.slot?.toLowerCase();

        console.log(`[SlotSelector] Item: ${item.details.name}, Type: ${itemType}, Slot: ${itemSlot}`);

        const slotOptions: SlotOption[] = [];

        // Weapons go to hands
        if (itemType === 'weapon') {
            slotOptions.push(
                { key: 'mainhand', label: 'Main Hand (Weapon)', icon: '⚔️' },
                { key: 'offhand', label: 'Off Hand (Dual Wield)', icon: '⚔️' }
            );
        }
        // Shields go to offhand
        else if (itemType === 'shield') {
            slotOptions.push({ key: 'offhand', label: 'Off Hand (Shield)', icon: '🛡️' });
        }
        // Armor goes to specific slots
        else if (itemType === 'armor') {
            switch (itemSlot) {
                case 'helmet': slotOptions.push({ key: 'helmet', label: 'Helmet', icon: '⛑️' }); break;
                case 'chest': slotOptions.push({ key: 'chest', label: 'Chest Armor', icon: '🦺' }); break;
                case 'gloves': slotOptions.push({ key: 'gloves', label: 'Gloves', icon: '🧤' }); break;
                case 'boots': slotOptions.push({ key: 'boots', label: 'Boots', icon: '🥾' }); break;
                case 'cape': slotOptions.push({ key: 'cape', label: 'Cape', icon: '🧥' }); break;
                case 'head': slotOptions.push({ key: 'head', label: 'Head', icon: '⛑️' }); break;
                case 'legs': slotOptions.push({ key: 'legs', label: 'Legs', icon: '👖' }); break;
                default:
                    // Fallback for generic armor or if slot is missing
                    console.warn(`[SlotSelector] Unknown armor slot: ${itemSlot}`);
                    slotOptions.push({ key: 'chest', label: 'Chest Armor (Default)', icon: '🦺' });
            }
        }
        // Accessories
        else if (itemType === 'accessory') {
            if (itemSlot === 'ring') {
                slotOptions.push(
                    { key: 'ring1', label: 'Ring Slot 1', icon: '💍' },
                    { key: 'ring2', label: 'Ring Slot 2', icon: '💍' },
                    { key: 'ring3', label: 'Ring Slot 3', icon: '💍' },
                    { key: 'ring4', label: 'Ring Slot 4', icon: '💍' }
                );
            } else if (itemSlot === 'amulet') {
                slotOptions.push({ key: 'amulet', label: 'Amulet', icon: '📿' });
            } else if (itemSlot === 'belt') {
                slotOptions.push({ key: 'belt', label: 'Belt', icon: '🪢' });
            } else if (itemSlot === 'artifact') {
                slotOptions.push({ key: 'artifact', label: 'Artifact', icon: '🔮' });
            }
        }

        return slotOptions;
    };

    const availableSlots = getAvailableSlots();

    const renderSlotOption = (slot: any) => (
        <TouchableOpacity
            key={slot.key}
            style={[styles.slotOption, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => onSelectSlot(slot.key)}
        >
            <Text style={[styles.slotIcon, { fontSize: 24 }]}>{slot.icon}</Text>
            <Text style={[styles.slotLabel, theme.typography.body, { color: theme.text }]}>
                {slot.label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <PixelCard style={[styles.modalContainer, { backgroundColor: theme.background, borderColor: theme.primary }]}>
                    <Text style={[styles.title, theme.typography.h2, { color: theme.text, marginBottom: spacing.md }]}>
                        {t.selectSlot || 'Select Equipment Slot'}
                    </Text>

                    <Text style={[styles.itemName, theme.typography.h3, { color: theme.primary, marginBottom: spacing.md }]}>
                        {item.details.name}
                    </Text>

                    <Text style={[styles.subtitle, theme.typography.body, { color: theme.textSecondary, marginBottom: spacing.lg }]}>
                        {t.chooseSlot || 'Choose where to equip this item:'}
                    </Text>

                    <ScrollView style={styles.slotsContainer} showsVerticalScrollIndicator={false}>
                        {availableSlots.map(renderSlotOption)}
                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.cancelButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            onPress={onCancel}
                        >
                            <Text style={[styles.cancelButtonText, theme.typography.bodyBold, { color: theme.text }]}>
                                {t.cancel || 'Cancel'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </PixelCard>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    modalContainer: {
        width: '90%',
        maxWidth: 400,
        maxHeight: '80%',
        padding: spacing.lg,
        borderWidth: 3,
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1,
    },
    itemName: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
    subtitle: {
        textAlign: 'center',
    },
    slotsContainer: {
        maxHeight: 300,
    },
    slotOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderWidth: 2,
        borderRadius: 8,
    },
    slotIcon: {
        marginRight: spacing.md,
    },
    slotLabel: {
        flex: 1,
        fontWeight: '600',
    },
    buttonContainer: {
        marginTop: spacing.lg,
        alignItems: 'center',
    },
    cancelButton: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderWidth: 2,
        borderRadius: 6,
        minWidth: 120,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontWeight: 'bold',
    },
});

export default SlotSelector;