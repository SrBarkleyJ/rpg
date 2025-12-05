import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import inventoryApi from '../../api/inventoryApi';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import PixelCard from '../../components/UI/Card';

// Image imports
import healthPotionImage from '../../../assets/images/health_potion.jpg';
import manaPotionImage from '../../../assets/images/mana_potion.jpg';
import swordBasicImage from '../../../assets/images/sword_basic.jpg';
import shieldBasicImage from '../../../assets/images/shield_basic.jpg';
import helmetBasicImage from '../../../assets/images/helmet_basic.jpg';
import bootsBasicImage from '../../../assets/images/boots_basic.jpg';
import ironSwordImage from '../../../assets/images/iron_sword.png';
import leatherArmorImage from '../../../assets/images/leather_armor.png';
import chainmailArmorImage from '../../../assets/images/chainmail_armor.png';
import luckyCharmImage from '../../../assets/images/lucky_charm.png';
import swiftBootsImage from '../../../assets/images/swift_boots.png';
import ringOfPowerImage from '../../../assets/images/ring_of_power.png';

const ITEM_IMAGES = {
    'health_potion': healthPotionImage,
    'mana_potion': manaPotionImage,
    'sword_basic': swordBasicImage,
    'shield_basic': shieldBasicImage,
    'helmet_basic': helmetBasicImage,
    'boots_basic': bootsBasicImage,
    'iron_sword': ironSwordImage,
    'leather_armor': leatherArmorImage,
    'chainmail_armor': chainmailArmorImage,
    'lucky_charm': luckyCharmImage,
    'swift_boots': swiftBootsImage,
    'ring_of_power': ringOfPowerImage,
};

const InventoryScreen = () => {
    const [inventory, setInventory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const { user, updateUser } = useAuth();
    const { theme } = useTheme();
    const { t } = useLanguage();

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
            // Ensure strict type matching
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
            <Text style={[styles.filterText, { color: filter === filterType ? theme.textLight : theme.text }]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    const getStatBonuses = (item: any) => {
        if (!item.details?.effects) return '';
        const effects = item.details.effects;
        const bonuses: string[] = [];
        if (effects.buffStrength) bonuses.push(`+${effects.buffStrength} STR`);
        if (effects.buffIntelligence) bonuses.push(`+${effects.buffIntelligence} INT`);
        if (effects.buffVitality) bonuses.push(`+${effects.buffVitality} VIT`);
        if (effects.buffDexterity) bonuses.push(`+${effects.buffDexterity} DEX`);
        if (effects.buffLuck) bonuses.push(`+${effects.buffLuck} LUCK`);
        if (effects.healHP) bonuses.push(`Heals ${effects.healHP} HP`);
        return bonuses.join(', ');
    };

    const getItemImage = (itemName: string) => {
        switch (itemName) {
            case 'Health Potion': return healthPotionImage;
            case 'Greater Health Potion': return healthPotionImage;
            case 'Mana Potion': return manaPotionImage;
            case 'Basic Sword': return swordBasicImage;
            case 'Iron Sword': return ironSwordImage;
            case 'Steel Sword': return swordBasicImage;
            case 'Basic Shield': return shieldBasicImage;
            case 'Basic Helmet': return helmetBasicImage;
            case 'Leather Armor': return leatherArmorImage;
            case 'Chainmail Armor': return chainmailArmorImage;
            case 'Basic Boots': return bootsBasicImage;
            case 'Swift Boots': return swiftBootsImage;
            case 'Lucky Charm': return luckyCharmImage;
            case 'Ring of Power': return ringOfPowerImage;
            default: return null;
        }
    };

    const renderItem = ({ item }) => {
        if (!item.details) return null;

        const canEquip = item.details.type !== 'consumable' && item.details.effects.duration === 0;
        const isEquipped = item.equipped;
        const itemImage = getItemImage(item.details.name);

        return (
            <PixelCard style={[styles.itemCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.itemContent}>
                    <View style={[styles.imageContainer, { backgroundColor: theme.background }]}>
                        {itemImage ? (
                            <Image
                                source={itemImage}
                                style={styles.itemImage}
                                resizeMode="contain"
                            />
                        ) : (
                            <Text style={styles.itemEmoji}>
                                {item.details.type === 'weapon' ? '⚔️' :
                                    item.details.type === 'armor' ? '🛡️' :
                                        item.details.type === 'accessory' ? '💍' :
                                            '🧪'}
                            </Text>
                        )}
                        {item.quantity > 1 && (
                            <View style={[styles.quantityBadge, { backgroundColor: theme.primary }]}>
                                <Text style={styles.quantityText}>x{item.quantity}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.itemInfo}>
                        <View style={styles.itemHeader}>
                            <Text style={[styles.itemName, { color: theme.text }]}>{item.details.name}</Text>
                            {isEquipped && (
                                <View style={[styles.equippedBadge, { backgroundColor: theme.success }]}>
                                    <Text style={[styles.equippedText, { color: theme.textLight }]}>{t.equipped}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={[styles.itemType, { color: theme.text }]}>{item.details.type.toUpperCase()}</Text>
                        {item.details.desc && (
                            <Text style={[styles.itemDesc, { color: theme.text }]}>{item.details.desc}</Text>
                        )}
                        {getStatBonuses(item) && (
                            <Text style={[styles.itemStats, { color: theme.secondary }]}>{getStatBonuses(item)}</Text>
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
                        <Text style={[styles.actionButtonText, { color: theme.textLight }]}>
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
                        <Text style={[styles.actionButtonText, { color: theme.textLight }]}>
                            💊 USE
                        </Text>
                    </TouchableOpacity>
                )}
            </PixelCard>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.textLight }]}>{t.inventoryTitle}</Text>
            </View>

            <View style={styles.filtersContainer}>
                {renderFilterButton('all', t.allItems)}
                {renderFilterButton('consumable', t.consumables)}
                {renderFilterButton('weapon', t.weapons)}
                {renderFilterButton('armor', t.armors)}
                {renderFilterButton('accessory', t.accessories)}
            </View>

            {loading ? (
                <Text style={{ color: theme.text, textAlign: 'center', marginTop: 20 }}>{t.loading}</Text>
            ) : (
                <FlatList
                    data={getFilteredInventory()}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={[styles.emptyText, { color: theme.text }]}>{t.emptyInventory}</Text>
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
        fontSize: 24,
        fontWeight: 'bold',
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
        fontSize: 12,
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
        fontSize: 40,
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
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    equippedBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    equippedText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    itemType: {
        fontSize: 11,
        opacity: 0.7,
        marginBottom: 4,
    },
    itemDesc: {
        fontSize: 12,
        marginBottom: 4,
    },
    itemStats: {
        fontSize: 12,
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
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
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
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default InventoryScreen;
