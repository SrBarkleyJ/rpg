import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback, useMemo, memo } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import rewardApi from '../../api/rewardApi';
import { useAuth } from '../../hooks/useAuth';
import { useInventory } from '../../hooks/useInventory';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import PixelCard from '../../components/UI/Card';
import { getItemImage } from '../../config/itemImages';
import { hapticSuccess } from '../../utils/haptics';
import AnimatedPressable from '../../components/UI/AnimatedPressable';
import ItemDetailModal from '../../components/modals/ItemDetailModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = (SCREEN_WIDTH - spacing.md * 2 - spacing.sm) / 2;

const ShopScreen = () => {
    const [allItems, setAllItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');
    const { user, updateUser } = useAuth();
    const { loadInventory } = useInventory();
    const { theme } = useTheme();
    const { t, translateItem } = useLanguage();

    // Modal state
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [itemDetailVisible, setItemDetailVisible] = useState(false);

    const categories = [
        { id: 'All', label: t.cat_all || 'All' },
        { id: 'Consumable', label: t.cat_consumable || 'Consumables' },
        { id: 'Weapon', label: t.cat_weapon || 'Weapons' },
        { id: 'Armor', label: t.cat_armor || 'Armor' },
        { id: 'Accessory', label: t.cat_accessory || 'Accessories' },
    ];

    useFocusEffect(
        useCallback(() => {
            loadItems();
        }, [])
    );

    const loadItems = async () => {
        try {
            setLoading(true);
            const data = await rewardApi.getRewards();
            console.log('Total items loaded:', data.length);
            console.log('Item types:', [...new Set(data.map(item => item.type))]);
            console.log('Item classes:', [...new Set(data.flatMap(item => item.allowedClasses))]);

            // Filtrar solo items que se pueden comprar
            const shopItems = data.filter(item => {
                const isShopItem = item.obtainableInShop !== false; // true o undefined
                const hasCost = item.cost > 0;
                return isShopItem && hasCost;
            });

            console.log('Shop items after filter:', shopItems.length);
            setAllItems(shopItems);
        } catch (error) {
            console.error('Error loading shop items:', error);
            Alert.alert(t.error || 'Error', t.failedToLoadShop || 'Failed to load shop');
        } finally {
            setLoading(false);
        }
    };

    // Función mejorada de filtrado
    const getFilteredItems = useMemo(() => {
        if (!allItems.length) return [];

        console.log(`Filtering items by category: ${category}`);

        return allItems.filter(item => {
            if (!item) return false;

            switch (category) {
                case 'All':
                    return true;

                case 'Consumable':
                    return item.type === 'consumable';

                case 'Weapon':
                    return item.type === 'weapon';

                case 'Armor':
                    return item.type === 'armor' || item.type === 'shield';

                case 'Accessory':
                    return item.type === 'accessory';

                case 'Warrior':
                    // Incluye items para warriors o items universales
                    return item.allowedClasses?.includes('warrior') ||
                        item.allowedClasses?.includes('all') ||
                        (item.allowedClasses?.length === 1 && item.allowedClasses[0] === 'warrior');

                case 'Mage':
                    return item.allowedClasses?.includes('mage') ||
                        item.allowedClasses?.includes('all') ||
                        (item.allowedClasses?.length === 1 && item.allowedClasses[0] === 'mage');

                case 'Rogue':
                    return item.allowedClasses?.includes('rogue') ||
                        item.allowedClasses?.includes('all') ||
                        (item.allowedClasses?.length === 1 && item.allowedClasses[0] === 'rogue');

                default:
                    return true;
            }
        });
    }, [allItems, category]);

    const handleBuyItem = useCallback(async (item) => {
        if (!user || user.gold < item.cost) {
            Alert.alert(t.error || 'Error', t.notEnoughGold || 'Not enough gold');
            return;
        }

        try {
            const result = await rewardApi.buyReward(item._id);
            if (result.data?.user) {
                // Update user state immediately without reloading all items
                await updateUser(result.data.user);
                await loadInventory(); // Only reload inventory

                hapticSuccess();
                Alert.alert(
                    t.success || 'Success',
                    `${t.buySuccess || 'Purchased'} ${translateItem(item.name)}!`
                );
            }
        } catch (error: any) {
            console.error('Purchase error:', error);
            Alert.alert(
                t.error || 'Error',
                error.response?.data?.message || t.failedToPurchase || 'Purchase failed'
            );
        }
    }, [user, updateUser, loadInventory, t, translateItem]);

    // Modal handlers
    const handleItemPress = useCallback((item) => {
        setSelectedItem(item);
        setItemDetailVisible(true);
    }, []);

    const handleCloseItemDetail = useCallback(() => {
        setItemDetailVisible(false);
        setSelectedItem(null);
    }, []);

    const handlePurchaseFromModal = useCallback(() => {
        if (selectedItem) {
            handleBuyItem(selectedItem);
            handleCloseItemDetail();
        }
    }, [selectedItem, handleBuyItem, handleCloseItemDetail]);

    const getRarityColor = (rarity) => {
        switch (rarity?.toLowerCase()) {
            case 'common': return '#b0b0b0';
            case 'uncommon': return '#4caf50';
            case 'rare': return '#42a5f5';
            case 'epic': return '#ab47bc';
            case 'legendary': return '#ffa726';
            default: return theme.text || '#000000';
        }
    };

    const renderItemImage = (item) => {
        const itemImage = getItemImage(item.image);

        if (itemImage) {
            return (
                <Image
                    source={itemImage}
                    style={styles.itemImage}
                    resizeMode="contain"
                />
            );
        }

        const emoji = item.type === 'weapon' ? '⚔️' :
            item.type === 'armor' ? '🛡️' :
                item.type === 'accessory' ? '💍' :
                    item.type === 'consumable' ? '🧪' :
                        item.type === 'shield' ? '🛡️' : '❓';

        return (
            <Text style={styles.itemEmoji}>{emoji}</Text>
        );
    };

    const renderItem = useCallback(({ item, index }) => {
        if (!item) return null;

        const name = translateItem(item.name);
        const canAfford = (user?.gold || 0) >= item.cost;

        return (
            <View style={[
                styles.itemContainer,
                {
                    marginLeft: index % 2 === 0 ? 0 : spacing.sm / 2,
                    marginRight: index % 2 === 0 ? spacing.sm / 2 : 0
                }
            ]}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleItemPress(item)}
                    style={{ flex: 1 }}
                >
                    <PixelCard
                        style={[
                            styles.itemCard,
                            {
                                borderColor: theme.border,
                                backgroundColor: theme.surface
                            }
                        ]}
                    >
                        <View style={styles.imageContainer}>
                            {renderItemImage(item)}
                        </View>

                        <View style={styles.textContainer}>
                            <Text
                                style={[
                                    styles.itemName,
                                    {
                                        color: getRarityColor(item.rarity),
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        textAlign: 'center'
                                    }
                                ]}
                                numberOfLines={2}
                            >
                                {name}
                            </Text>

                            <Text
                                style={[
                                    styles.itemType,
                                    {
                                        color: theme.text,
                                        opacity: 0.7,
                                        fontSize: 11,
                                        textAlign: 'center',
                                        marginTop: 4
                                    }
                                ]}
                                numberOfLines={1}
                            >
                                {t[item.type] || item.type} • {t[item.rarity] || item.rarity}
                            </Text>
                        </View>

                        <View style={styles.priceContainer}>
                            <Text style={[
                                styles.priceText,
                                {
                                    color: canAfford ? theme.warning : theme.danger,
                                    opacity: canAfford ? 1 : 0.6,
                                    fontSize: 13,
                                    fontWeight: 'bold'
                                }
                            ]}>
                                {item.cost} {t.gold || 'Gold'}
                            </Text>
                        </View>

                        <AnimatedPressable
                            style={[
                                styles.buyButton,
                                {
                                    backgroundColor: canAfford ? theme.primary : theme.border,
                                    borderColor: theme.border,
                                    opacity: canAfford ? 1 : 0.7
                                }
                            ]}
                            onPress={() => canAfford && handleBuyItem(item)}
                            disabled={!canAfford}
                        >
                            <Text style={[
                                styles.buyButtonText,
                                {
                                    color: theme.textLight,
                                    fontSize: 12,
                                    fontWeight: 'bold'
                                }
                            ]}>
                                {canAfford ? (t.buy || 'Buy') : (t.cannotAfford || 'Too Expensive')}
                            </Text>
                        </AnimatedPressable>

                        <TouchableOpacity
                            style={[styles.infoButton, { marginTop: spacing.sm }]}
                            onPress={() => handleItemPress(item)}
                        >
                            <Text style={{ color: theme.textSecondary, fontSize: 12, textDecorationLine: 'underline' }}>
                                {t.viewDetails || 'View Details'}
                            </Text>
                        </TouchableOpacity>
                    </PixelCard>
                </TouchableOpacity>
            </View>
        );
    }, [user?.gold, theme, t, translateItem, handleItemPress, handleBuyItem]);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[
                    styles.headerTitle,
                    {
                        color: theme.textLight,
                        fontSize: 20,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        flex: 1
                    }
                ]}>
                    {t.shopTitle || 'Shop'}
                </Text>
                <View style={[
                    styles.goldContainer,
                    {
                        backgroundColor: theme.surface,
                        borderColor: theme.warning
                    }
                ]}>
                    <Text style={[
                        {
                            color: theme.warning,
                            fontSize: 16,
                            fontWeight: 'bold'
                        }
                    ]}>
                        💰 {user?.gold || 0}
                    </Text>
                </View>
            </View>

            <View style={styles.filterContainer}>
                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item: cat }) => (
                        <TouchableOpacity
                            style={[
                                styles.filterButton,
                                {
                                    borderColor: theme.border,
                                    backgroundColor: category === cat.id ? theme.primary : theme.surface
                                }
                            ]}
                            onPress={() => setCategory(cat.id)}
                        >
                            <Text style={[
                                {
                                    color: category === cat.id ? theme.textLight : theme.text,
                                    fontSize: 12,
                                    fontWeight: 'bold'
                                }
                            ]}>
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.filterListContent}
                />
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={{ color: theme.text, marginTop: 20 }}>
                        {t.loading || 'Loading...'}
                    </Text>
                </View>
            ) : getFilteredItems.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Text style={{ color: theme.text, textAlign: 'center' }}>
                        {t.noItemsAvailable || 'No items available'}
                    </Text>
                    <Text style={{ color: theme.text, opacity: 0.7, marginTop: 10 }}>
                        Category: {category}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={getFilteredItems}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => renderItem({ item, index })}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={() => (
                        <Text style={[
                            styles.categoryHeader,
                            { color: theme.text, opacity: 0.8 }
                        ]}>
                            {categories.find(c => c.id === category)?.label || 'Items'} ({getFilteredItems.length})
                        </Text>
                    )}
                />
            )}

            {/* Item Detail Modal */}
            <ItemDetailModal
                visible={itemDetailVisible}
                item={selectedItem}
                onClose={handleCloseItemDetail}
                onPurchase={handlePurchaseFromModal}
                showPurchaseButton={selectedItem && (user?.gold || 0) >= (selectedItem?.cost || 0)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    headerTitle: {
        letterSpacing: 1,
        textShadowColor: 'black',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    goldContainer: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 2,
    },
    filterContainer: {
        marginBottom: spacing.md,
        height: 50,
    },
    filterListContent: {
        paddingHorizontal: 4,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 20,
        borderWidth: 1,
        justifyContent: 'center',
        minHeight: 40,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 100,
    },
    categoryHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    itemContainer: {
        width: ITEM_WIDTH,
        marginBottom: spacing.md,
    },
    itemCard: {
        width: '100%',
        padding: spacing.sm,
        alignItems: 'center',
        borderWidth: 2,
        borderRadius: 8,
    },
    imageContainer: {
        width: ITEM_WIDTH - spacing.sm * 2,
        height: ITEM_WIDTH - spacing.sm * 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
        backgroundColor: '#FFFFFF',
        borderRadius: 6,

        overflow: 'hidden',
        position: 'relative',
    },
    infoButton: {
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemImage: {
        width: '90%',
        height: '90%',
    },
    itemEmoji: {
        fontSize: 32,
    },
    textContainer: {
        width: '100%',
        minHeight: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    itemName: {
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    itemType: {
        textTransform: 'uppercase',
    },
    priceContainer: {
        marginBottom: spacing.sm,
        paddingVertical: 4,
    },
    priceText: {
        textAlign: 'center',
    },
    buyButton: {
        width: '100%',
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
        borderWidth: 2,
    },
    buyButtonText: {
        textTransform: 'uppercase',
    },
});

export default memo(ShopScreen);