import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import EquipmentDisplay from '../Equipment/EquipmentDisplay';

interface EquipmentModalProps {
    visible: boolean;
    equipment: any;
    onClose: () => void;
    onEquipmentPress: (slot: string) => void;
}

/**
 * Modal to show full equipment layout
 * Triggered when user wants to verify their gear or select a slot
 */
const EquipmentModal: React.FC<EquipmentModalProps> = ({ visible, equipment, onClose, onEquipmentPress }) => {
    const { theme } = useTheme();
    const { t } = useLanguage();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.modalContainer, { backgroundColor: theme.background, borderColor: theme.primary }]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, theme.typography.h2, { color: theme.text }]}>
                            {t.equipment || 'Equipment'}
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[styles.closeButton, { backgroundColor: theme.danger }]}
                        >
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <EquipmentDisplay
                            equipment={equipment}
                            onEquipmentPress={onEquipmentPress}
                        />
                    </ScrollView>

                    <Text style={[styles.hint, { color: theme.textSecondary }]}>
                        {t.tapSlotToUnequip || 'Tap a slot to unequip an item'}
                    </Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        padding: spacing.md,
    },
    modalContainer: {
        flex: 1,
        borderWidth: 2,
        borderRadius: 8,
        marginVertical: spacing.xl,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    title: {
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: spacing.sm,
    },
    hint: {
        textAlign: 'center',
        padding: spacing.md,
        fontStyle: 'italic',
    }
});

export default EquipmentModal;
