import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import Reanimated, { Layout } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import inventoryApi from '../../api/inventoryApi';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import PixelCard from '../../components/UI/Card';
import { getItemImage } from '../../config/itemImages';

const InventoryScreen = () => {
    const [inventory, setInventory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const { user, updateUser } = useAuth();
    const { theme } = useTheme();
    const { t, translateItem } = useLanguage();

    useFocusEffect(
        useCallback(() => {
            loadInventory();
        }, [])
    );

    const loadInventory = async () => {
        try {
            setLoading(true);
            const data = await inventoryApi.getInventory();
            setInventory(data.data);
        } catch (error) {
            console.error(error);
            Alert.alert(t.error, t.failedToLoadInventory);
        } finally {
            setLoading(false);
        }
    };

    const handleEquip = async (itemId: string) => {
        try {
            const result = await inventoryApi.equipItem(itemId);
            if (result.data.user) {
                await updateUser(result.data.user);
                Alert.alert(t.success, t.itemEquipped);
                loadInventory();
            }
        } catch (error) {
            console.error(error);
            Alert.alert(t.error, error.response?.data?.message || t.failedToEquip);
        }
    };

    const handleUnequip = async (itemId: string) => {
        try {
            const result = await inventoryApi.unequipItem(itemId);
            if (result.data.user) {
                await updateUser(result.data.user);
                Alert.alert(t.success, t.itemUnequipped);
                loadInventory();
            }
        } catch (error) {
            console.error(error);
            Alert.alert(t.error, error.response?.data?.message || t.failedToUnequip);
        }
    };

    const handleUseItem = async (itemId: string) => {
        try {
            const result = await inventoryApi.useItem(itemId);
            if (result.data.user) {
                await updateUser(result.data.user);
                Alert.alert(t.success, result.data.message);
                loadInventory();
            }
        } catch (error) {
            console.error(error);
            Alert.alert(t.error, error.response?.data?.message || 'Failed to use item');
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

    const getStatBonuses = (item: any) => {
        if (!item.details?.effects) return '';
        const effects = item.details.effects;
        const bonuses: string[] = [];
        if (effects.buffStrength) bonuses.push(`+${effects.buffStrength} ${t.strength}`);
        if (effects.buffIntelligence) bonuses.push(`+${effects.buffIntelligence} ${t.intelligence}`);
        if (effects.buffVitality) bonuses.push(`+${effects.buffVitality} ${t.vitality}`);
        if (effects.buffDexterity) bonuses.push(`+${effects.buffDexterity} ${t.dexterity}`);
        if (effects.buffLuck) bonuses.push(`+${effects.buffLuck} ${t.luckStat}`);
        if (effects.healHP) bonuses.push(`${t.heals} ${effects.healHP} ${t.hp}`);
        if (effects.healMana) bonuses.push(`${t.heals} ${effects.healMana} ${t.mana}`);
        return bonuses.join(', ');
    };

    const renderItem = ({ item }) => {
        if (!item.details) return null;

        const name = translateItem(item.details.name);

        const canEquip = item.details.type !== 'consumable' && item.details.effects.duration === 0;
        const isEquipped = item.equipped;
        // Use the image key from the item details if available
        const itemImage = getItemImage(item.details.image || item.details.name?.toLowerCase().replace(/ /g, '_'));


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
                                <Text style={[styles.itemName, theme.typography.h3, { color: theme.text }]}>{name}</Text>
                                {isEquipped && (
                                    <View style={[styles.equippedBadge, { backgroundColor: theme.success }]}>
                                        <Text style={[styles.equippedText, theme.typography.caption, { color: theme.textLight }]}>{t.equipped}</Text>
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
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, theme.typography.h1, { color: theme.textLight }]}>{t.inventoryTitle}</Text>
            </View>

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
});

export default InventoryScreen;
