import React, { useState, useEffect, useCallback, memo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import Reanimated, { Layout } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import inventoryApi from '../../api/inventoryApi';
import { useAuth } from '../../hooks/useAuth';
import { useInventory } from '../../hooks/useInventory';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import PixelCard from '../../components/UI/Card';
import { getItemImage } from '../../config/itemImages';
import EquipmentModal from '../../components/Equipment/EquipmentModal';

interface InventoryItemProps {
    item: any;
    theme: any;
    t: any;
    translateItem: (name: string) => string;
    getItemImage: (imageKey: string) => any;
    handleEquip: (invId: string) => void;
    handleUnequip: (invId: string) => void;
    handleUseItem: (invId: string) => void;
}

const InventoryItem = memo<InventoryItemProps>(({
    item,
    theme,
    t,
    translateItem,
    getItemImage,
    handleEquip,
    handleUnequip,
    handleUseItem
}) => {
    if (!item.details) return null;

    const name = translateItem(item.details.name);
    const canEquip = item.details.type !== 'consumable' && item.details.effects.duration === 0;
    const isEquipped = item.equipped;
    const itemImage = getItemImage(item.details.image || item.details.name?.toLowerCase().replace(/ /g, '_'));

    const getStatBonuses = (item: any) => {
        if (!item.details?.effects) return '';
        const effects = item.details.effects;
        const bonuses: string[] = [];
        if (effects.buffStrength) bonuses.push(`+${effects.buffStrength} ${t.strength?.substring(0, 3).toUpperCase() || 'STR'}`);
        if (effects.buffIntelligence) bonuses.push(`+${effects.buffIntelligence} ${t.intelligence?.substring(0, 3).toUpperCase() || 'INT'}`);
        if (effects.buffVitality) bonuses.push(`+${effects.buffVitality} ${t.vitality?.substring(0, 3).toUpperCase() || 'VIT'}`);
        if (effects.buffDexterity) bonuses.push(`+${effects.buffDexterity} ${t.dexterity?.substring(0, 3).toUpperCase() || 'DEX'}`);
        if (effects.buffLuck) bonuses.push(`+${effects.buffLuck} ${t.luck?.substring(0, 3).toUpperCase() || 'LCK'}`);
        if (effects.healHP) bonuses.push(`${t.heals} ${effects.healHP} ${t.hp}`);
        if (effects.healMana) bonuses.push(`${t.heals} ${effects.healMana} ${t.mp}`);
        return bonuses.join(', ');
    };

    return (
        <Reanimated.View layout={Layout.springify()}>
            <PixelCard style={[styles.itemCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.itemContent}>
                    <View style={[styles.imageContainer, { backgroundColor: '#FFFFFF' }]}>
                        {itemImage ? (
                            <Image
                                source={itemImage}
                                style={styles.itemImage}
                                resizeMode="contain"
                            />
                        ) : (
                            <Text style={[styles.itemEmoji, theme.typography.h1]}>
                                {item.details.type === 'weapon' ? '⚔️' :
                                    item.details.type === 'armor' ? '🛡️' :
                                        item.details.type === 'accessory' ? '💍' :
                                            '🧪'}
                            </Text>
                        )}
                        {item.quantity > 1 && (
                            <View style={[styles.quantityBadge, { backgroundColor: theme.primary }]}>
                                <Text style={[styles.quantityText, theme.typography.caption]}>x{item.quantity}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.itemInfo}>
                        <View style={styles.itemHeader}>
                            <Text style={[styles.itemName, theme.typography.bodyBold, { color: theme.text }]}>
                                {name}
                            </Text>
                            {isEquipped && (
                                <View style={[styles.equippedBadge, { backgroundColor: theme.success }]}>
                                    <Text style={[styles.equippedText, theme.typography.caption, { color: theme.textLight }]}>
                                        {t.equipped}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Text style={[styles.itemType, theme.typography.caption, { color: theme.text }]}>
                            {t[item.details.type] ? t[item.details.type].toUpperCase() : item.details.type.toUpperCase()}
                        </Text>
                        {item.details.desc && (
                            <Text style={[styles.itemDesc, theme.typography.small, { color: theme.text }]}>{item.details.desc}</Text>
                        )}
                        {getStatBonuses(item) && (
                            <Text style={[styles.itemStats, theme.typography.small, { color: theme.secondary }]}>{getStatBonuses(item)}</Text>
                        )}
                    </View>
                </View>

                {canEquip && (
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            { backgroundColor: isEquipped ? theme.danger : theme.primary, borderColor: theme.border }
                        ]}
                        onPress={() => isEquipped ? handleUnequip(item._id) : handleEquip(item._id)}
                    >
                        <Text style={[styles.actionButtonText, theme.typography.bodyBold, { color: theme.textLight }]}>
                            {isEquipped ? t.unequip : t.equip}
                        </Text>
                    </TouchableOpacity>
                )}

                {item.details.type === 'consumable' && (
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            { backgroundColor: theme.success, borderColor: theme.border, marginTop: spacing.sm }
                        ]}
                        onPress={() => handleUseItem(item._id)}
                    >
                        <Text style={[styles.actionButtonText, theme.typography.bodyBold, { color: theme.textLight }]}>
                            💊 {t.use || 'USE'}
                        </Text>
                    </TouchableOpacity>
                )}
            </PixelCard>
        </Reanimated.View>
    );
});

const InventoryScreen = () => {
    const [filter, setFilter] = useState('all');
    const [ringSelectorVisible, setRingSelectorVisible] = useState(false);
    const [selectedRingForEquip, setSelectedRingForEquip] = useState<any>(null);
    const [equippedRings, setEquippedRings] = useState<any[]>([]);
    const [equipmentModalVisible, setEquipmentModalVisible] = useState(false);
    const { user, updateUser } = useAuth();
    const { inventory, isInventoryLoading: loading, loadInventory, updateInventory } = useInventory();
    const { theme } = useTheme();
    const { t, translateItem } = useLanguage();

    useFocusEffect(
        useCallback(() => {
            loadInventory();
        }, [loadInventory])
    );

    const handleEquip = async (invId: string) => {
        // Find the item in inventory
        const item = inventory.find(inv => inv._id === invId);
        if (!item) {
            Alert.alert(t.error, t.itemNotFound);
            return;
        }

        const itemType = item.details?.type;
        const itemSlot = item.details?.slot;

        if (itemType === 'accessory' && itemSlot === 'ring') {
            // Special handling for rings - can equip up to 4
            const currentEquippedRings = inventory.filter((inv: any) => 
                inv.equipped && inv.details?.slot === 'ring'
            );

            if (currentEquippedRings.length >= 4) {
                // Show ring selector to choose which one to replace
                setSelectedRingForEquip(item);
                setEquippedRings(currentEquippedRings);
                setRingSelectorVisible(true);
            } else {
                // Equip in next available ring slot
                const ringSlots = ['ring1', 'ring2', 'ring3', 'ring4'];
                const usedSlots = currentEquippedRings.map((ring: any) => ring.equippedSlot);
                const availableSlot = ringSlots.find(slot => !usedSlots.includes(slot)) || 'ring1';

                try {
                    const result = await inventoryApi.equipItem({
                        invId: item._id,
                        slot: availableSlot
                    });
                    if (result.data.data?.user) {
                        await updateUser(result.data.data.user);
                        Alert.alert(t.success, t.itemEquipped);
                        // Reload inventory to get updated details
                        await loadInventory();
                    }
                } catch (error) {
                    console.error(error);
                    Alert.alert(t.error, error.response?.data?.message || t.failedToEquip);
                }
            }
        } else {
            // For all other items, equip directly in their designated slot
            try {
                const result = await inventoryApi.equipItem({
                    invId: item._id,
                    slot: itemSlot // Use the item's natural slot
                });
                if (result.data.data?.user) {
                    await updateUser(result.data.data.user);
                    Alert.alert(t.success, t.itemEquipped);
                    // Reload inventory to get updated details
                    await loadInventory();
                }
            } catch (error) {
                console.error(error);
                Alert.alert(t.error, error.response?.data?.message || t.failedToEquip);
            }
        }
    };

    const handleUnequip = async (invId: string) => {
        try {
            // Can unequip by invId (backend finds the slot from inventory.equippedSlot)
            const result = await inventoryApi.unequipItem({ invId });
            if (result.data.data?.user) {
                await updateUser(result.data.data.user);
                Alert.alert(t.success, t.itemUnequipped);
                // Reload inventory to get updated details
                await loadInventory();
            }
        } catch (error) {
            console.error(error);
            Alert.alert(t.error, error.response?.data?.message || t.failedToUnequip);
        }
    };

    const handleRingSelected = async (ringToReplace: any) => {
        if (!selectedRingForEquip) return;

        try {
            // First unequip the ring to replace
            if (ringToReplace) {
                await inventoryApi.unequipItem({ invId: ringToReplace._id });
            }

            // Then equip the new ring in the freed slot
            const result = await inventoryApi.equipItem({
                invId: selectedRingForEquip._id,
                slot: ringToReplace?.equippedSlot || 'ring1'
            });

            if (result.data.data?.user) {
                await updateUser(result.data.data.user);
                Alert.alert(t.success, t.itemEquipped);
                // Reload inventory to get updated details
                await loadInventory();
            }
        } catch (error) {
            console.error(error);
            Alert.alert(t.error, error.response?.data?.message || t.failedToEquip);
        } finally {
            // Close the ring selector
            setRingSelectorVisible(false);
            setSelectedRingForEquip(null);
            setEquippedRings([]);
        }
    };

    const handleRingSelectorCancel = () => {
        setRingSelectorVisible(false);
        setSelectedRingForEquip(null);
        setEquippedRings([]);
    };

    const handleUseItem = async (invId: string) => {
        try {
            const result = await inventoryApi.useItem(invId);
            if (result.data.data?.user) {
                await updateUser(result.data.data.user);
                Alert.alert(t.success, t.itemUsed);
                // Reload inventory to get updated details
                await loadInventory();
            }
        } catch (error) {
            console.error(error);
            Alert.alert(t.error, error.response?.data?.message || t.failedToUseItem);
        }
    };

    const handleEquipmentPress = async (slot: string) => {
        try {
            if (!user) return;
            const slotData = (user as any).equipment?.[slot];
            if (!slotData || !slotData.itemId) {
                // nothing equipped in this slot - switch filter to accessories
                setFilter('accessory');
                return;
            }

            // Find the inventory item for this equipped slot
            const equippedInvItem = (user as any).inventory?.find(
                (inv: any) => inv.equippedSlot === slot && inv.equipped
            );

            if (equippedInvItem?._id) {
                // Unequip by invId
                const result = await inventoryApi.unequipItem({ invId: equippedInvItem._id });
                if (result.data?.data?.user) {
                    await updateUser(result.data.data.user);
                    Alert.alert(t.success, t.itemUnequipped);
                    loadInventory();
                }
            } else {
                // Fallback: unequip by slot
                const result = await inventoryApi.unequipItem({ slot });
                if (result.data?.data?.user) {
                    await updateUser(result.data.data.user);
                    Alert.alert(t.success, t.itemUnequipped);
                    loadInventory();
                }
            }
        } catch (error) {
            console.error(error);
            Alert.alert(t.error, error.response?.data?.message || t.failedToUnequip);
        }
    };

    const getFilteredInventory = () => {
        if (filter === 'all') return inventory;
        return inventory.filter(item => {
            if (!item.details) return false;
            const itemType = item.details.type?.toLowerCase();
            if (filter === 'consumable') return itemType === 'consumable';
            if (filter === 'weapon') return itemType === 'weapon';
            if (filter === 'armor') return itemType === 'armor';
            if (filter === 'accessory') return itemType === 'accessory';
            return true;
        });
    };

    const renderFilterButton = (filterType: string, label: string) => (
        <TouchableOpacity
            key={filterType}
            style={[
                styles.filterButton,
                { backgroundColor: filter === filterType ? theme.primary : theme.surface, borderColor: theme.border }
            ]}
            onPress={() => setFilter(filterType)}
        >
            <Text style={[styles.filterText, theme.typography.small, { color: filter === filterType ? theme.textLight : theme.text }]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => (
        <InventoryItem
            item={item}
            theme={theme}
            t={t}
            translateItem={translateItem}
            getItemImage={getItemImage}
            handleEquip={handleEquip}
            handleUnequip={handleUnequip}
            handleUseItem={handleUseItem}
        />
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, theme.typography.h1, { color: theme.textLight }]}>{t.inventoryTitle}</Text>
            </View>
            {/* Equipment display (Dark Souls style rings + other slots) */}
            {/* Equipment Button (Floating or Top Bar) */}
            <TouchableOpacity
                style={[styles.viewEquipmentButton, { backgroundColor: theme.secondary, borderColor: theme.border }]}
                onPress={() => setEquipmentModalVisible(true)}
            >
                <Text style={[styles.viewEquipmentText, { color: theme.textLight }]}>
                    🛡️ {t.viewEquipment}
                </Text>
            </TouchableOpacity>

            <EquipmentModal
                visible={equipmentModalVisible}
                equipment={(user as any).equipment || {}}
                onClose={() => setEquipmentModalVisible(false)}
                onEquipmentPress={handleEquipmentPress}
            />

            <View style={styles.filtersContainer}>
                {renderFilterButton('all', t.allItems)}
                {renderFilterButton('consumable', t.consumables)}
                {renderFilterButton('weapon', t.weapons)}
                {renderFilterButton('armor', t.armors)}
                {renderFilterButton('accessory', t.accessories)}
            </View>

            {loading ? (
                <Text style={[theme.typography.body, { color: theme.text, textAlign: 'center', marginTop: 20 }]}>{t.loading}</Text>
            ) : (
                <FlatList
                    data={getFilteredInventory()}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={[styles.listContent, { paddingBottom: 90 }]}
                    ListEmptyComponent={
                        <Text style={[styles.emptyText, theme.typography.h3, { color: theme.text }]}>{t.emptyInventory}</Text>
                    }
                />
            )}

            {/* Ring Selector Modal */}
            {ringSelectorVisible && (
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Text style={[styles.modalTitle, theme.typography.h2, { color: theme.text }]}>
                            {t.selectRingToReplace || 'Select Ring to Replace'}
                        </Text>
                        <Text style={[styles.modalSubtitle, theme.typography.body, { color: theme.text }]}>
                            {t.ringsEquippedMessage || 'You have 4 rings equipped. Choose which one to replace:'}
                        </Text>

                        {equippedRings.map((ring: any) => (
                            <TouchableOpacity
                                key={ring._id}
                                style={[styles.ringOption, { backgroundColor: theme.background, borderColor: theme.border }]}
                                onPress={() => handleRingSelected(ring)}
                            >
                                <Image
                                    source={getItemImage(ring.details?.image)}
                                    style={styles.ringImage}
                                />
                                <View style={styles.ringInfo}>
                                    <Text style={[styles.ringName, theme.typography.bodyBold, { color: theme.text }]}>
                                        {translateItem(ring.details?.name)}
                                    </Text>
                                    <Text style={[styles.ringDesc, theme.typography.small, { color: theme.textLight }]}>
                                        {ring.details?.desc}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            style={[styles.cancelButton, { backgroundColor: theme.danger, borderColor: theme.border }]}
                            onPress={handleRingSelectorCancel}
                        >
                            <Text style={[styles.cancelButtonText, theme.typography.bodyBold, { color: theme.textLight }]}>
                                {t.cancel}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.md,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.md,
        marginTop: spacing.md,
    },
    headerTitle: {


        letterSpacing: 2,
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },
    filtersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: spacing.md,
        gap: spacing.sm,
    },
    filterButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 2,
        borderRadius: 4,
    },
    filterText: {

        fontWeight: 'bold',
    },
    listContent: {
        paddingBottom: spacing.xl,
    },
    itemCard: {
        marginBottom: spacing.md,
        padding: spacing.md,
        borderWidth: 2,
    },
    itemContent: {
        flexDirection: 'row',
        marginBottom: spacing.sm,
    },
    imageContainer: {
        width: 60,
        height: 60,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    itemImage: {
        width: 50,
        height: 50,
    },
    itemEmoji: {

    },
    itemInfo: {
        flex: 1,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    itemName: {

        fontWeight: 'bold',
        flex: 1,
    },
    equippedBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    equippedText: {

        fontWeight: 'bold',
    },
    itemType: {

        opacity: 0.7,
        marginBottom: 4,
    },
    itemDesc: {

        marginBottom: 4,
    },
    itemStats: {

        fontWeight: 'bold',
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        borderWidth: 2,
        alignItems: 'center',
    },
    actionButtonText: {

        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,

    },
    quantityBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white',
    },
    quantityText: {
        color: 'white',

        fontWeight: 'bold',
    },
    viewEquipmentButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        borderWidth: 2,
        zIndex: 10,
    },
    viewEquipmentText: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        width: '90%',
        maxWidth: 400,
        borderRadius: 8,
        borderWidth: 2,
        padding: spacing.lg,
        alignItems: 'center',
    },
    modalTitle: {
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    modalSubtitle: {
        marginBottom: spacing.lg,
        textAlign: 'center',
        opacity: 0.8,
    },
    ringOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 6,
        borderWidth: 1,
        marginBottom: spacing.sm,
        width: '100%',
    },
    ringImage: {
        width: 40,
        height: 40,
        marginRight: spacing.md,
        borderRadius: 4,
    },
    ringInfo: {
        flex: 1,
    },
    ringName: {
        marginBottom: 2,
    },
    ringDesc: {
        opacity: 0.7,
    },
    cancelButton: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: 6,
        borderWidth: 2,
        marginTop: spacing.md,
        width: '100%',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontWeight: 'bold',
    },
});

export default InventoryScreen;
