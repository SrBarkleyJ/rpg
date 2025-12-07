import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import PixelCard from '../../components/UI/Card';
import { spacing } from '../../theme/spacing';

interface InventoryModalProps {
    visible: boolean;
    populatedInventory: any[];
    theme: any;
    t: any;
    onUseItem: (itemId: string) => void;
    onClose: () => void;
}

const InventoryModal: React.FC<InventoryModalProps> = ({
    visible,
    populatedInventory,
    theme,
    t,
    onUseItem,
    onClose,
}) => {
    const renderInventoryItem = ({ item }: { item: any }) => {
        if (!item.details) return null;

        return (
            <TouchableOpacity
                style={[styles.invItem, { borderColor: theme.border, backgroundColor: theme.background }]}
                onPress={() => onUseItem(item.itemId || item.details._id)}
            >
                <View style={styles.invInfo}>
                    <Text style={[styles.invName, { color: theme.text }]}>{item.details.name}</Text>
                    <Text style={[styles.invDesc, { color: theme.text, fontSize: 10 }]}>{item.details.desc}</Text>
                    <Text style={[styles.invQty, { color: theme.secondary }]}>x{item.quantity}</Text>
                </View>
                <Text style={[styles.useText, { color: theme.primary }]}>{t.use}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <PixelCard style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Text style={[styles.modalTitle, { color: theme.text }]}>{t.inventoryTitle}</Text>

                    {populatedInventory.length === 0 ? (
                        <Text style={[styles.emptyText, { color: theme.text }]}>{t.noConsumables}</Text>
                    ) : (
                        <FlatList
                            data={populatedInventory}
                            keyExtractor={(item) => item._id}
                            renderItem={renderInventoryItem}
                        />
                    )}

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
    emptyText: {
        textAlign: 'center',
        fontStyle: 'italic',
        marginVertical: 20,
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
        fontSize: 14,
        marginBottom: 4,
    },
    invDesc: {
        fontSize: 10,
        opacity: 0.8,
        marginBottom: 4,
    },
    invQty: {
        fontSize: 12,
    },
    useText: {
        fontWeight: 'bold',
        fontSize: 12,
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

export default InventoryModal;