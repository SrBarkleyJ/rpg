import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import rewardApi from '../../api/rewardApi';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import PixelCard from '../../components/UI/Card';
import { getItemImage } from '../../config/itemImages';

const ShopScreen = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');
    const { user, updateUser } = useAuth();
    const { theme } = useTheme();
    const { t, translateItem } = useLanguage();

    const categories = [
        { id: 'All', label: t.cat_all },
        { id: 'Consumable', label: t.cat_consumable },
        { id: 'Warrior', label: t.cat_warrior },
        { id: 'Mage', label: t.cat_mage },
        { id: 'Rogue', label: t.cat_rogue },
        { id: 'Armor', label: t.cat_armor },
        { id: 'Accessory', label: t.cat_accessory }
    ];

    useFocusEffect(
        useCallback(() => {
            loadItems();
            // refreshUser(); // Removed as it is not available in useAuth
        }, [])
    );

    const loadItems = async () => {
        try {
            const data = await rewardApi.getRewards();
            setItems(data);
        } catch (error) {
            console.error(error);
            Alert.alert(t.error, t.failedToLoadShop);
        } finally {
            setLoading(false);
        }
    };

    const handleBuyItem = async (item) => {
        if (user.gold < item.cost) {
            Alert.alert(t.error, t.notEnoughGold);
            return;
        }

        try {
            const result = await rewardApi.buyReward(item._id);
            if (result.user) {
                await updateUser(result.user);
                Alert.alert(t.success, `${t.buySuccess} ${translateItem(item.name)}!`);
            }
        } catch (error) {
            console.error(error);
            Alert.alert(t.error, t.failedToPurchase);
        }
    };

    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'common': return '#b0b0b0';
            case 'uncommon': return '#4caf50';
            case 'rare': return '#42a5f5';
            case 'epic': return '#ab47bc';
            case 'legendary': return '#ffa726';
            default: return theme.text;
        }
    };

    const getFilteredItems = () => {
        return items.filter(item => {
            if (category === 'All') return true;
            if (category === 'Consumable') return item.type === 'consumable';
            if (category === 'Warrior') return item.allowedClasses.includes('warrior');
            if (category === 'Mage') return item.allowedClasses.includes('mage');
            if (category === 'Rogue') return item.allowedClasses.includes('rogue');
            if (category === 'Armor') return item.type === 'armor';
            if (category === 'Accessory') return item.type === 'accessory';
            return true;
        });
    };

    const renderItem = ({ item }) => {
        const name = translateItem(item.name);
        const itemImage = getItemImage(item.image);

        return (
            <PixelCard style={[styles.itemCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={[styles.imageContainer, { backgroundColor: '#00000040' }]}>
                    {itemImage ? (
                        <Image
                            source={itemImage}
                            style={styles.itemImage}
                            resizeMode="contain"
                        />
                    ) : (
                        <Text style={[styles.itemEmoji, theme.typography.h1]}>
                            {item.type === 'weapon' ? '⚔️' :
                                item.type === 'armor' ? '🛡️' :
                                    item.type === 'accessory' ? '💍' :
                                        '🧪'}
                        </Text>
                    )}
                </View>

                <View style={styles.textContainer}>
                    <Text style={[styles.itemName, theme.typography.h3, { color: getRarityColor(item.rarity) }]}>{name}</Text>
                    <Text style={[styles.itemType, theme.typography.small, { color: theme.text, opacity: 0.7 }]}>{item.type}</Text>
                </View>

                <View style={styles.priceContainer}>
                    <Text style={[styles.priceText, theme.typography.bodyBold, { color: theme.warning }]}>{item.cost} {t.gold}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.buyButton, { backgroundColor: theme.primary, borderColor: theme.border }]}
                    onPress={() => handleBuyItem(item)}
                >
                    <Text style={[styles.buyButtonText, theme.typography.bodyBold, { color: theme.textLight }]}>{t.buy}</Text>
                </TouchableOpacity>
            </PixelCard>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, theme.typography.h1, { color: theme.textLight }]}>{t.shopTitle}</Text>
                <View style={[styles.goldContainer, { backgroundColor: theme.surface, borderColor: theme.warning }]}>
                    <Text style={[styles.goldText, theme.typography.h3, { color: theme.warning }]}>💰 {user?.gold || 0}</Text>
                </View>
            </View>

            <View style={styles.filterContainer}>
                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.filterButton,
                                category === item.id && { backgroundColor: theme.primary, borderColor: theme.warning },
                                { borderColor: theme.border }
                            ]}
                            onPress={() => setCategory(item.id)}
                        >
                            <Text style={[
                                styles.filterText, theme.typography.bodyBold,
                                category === item.id ? { color: theme.textLight } : { color: theme.textLight }
                            ]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {loading ? (
                <Text style={[theme.typography.body, { color: theme.textLight, textAlign: 'center', marginTop: 20 }]}>{t.loading}</Text>
            ) : (
                <FlatList
                    data={getFilteredItems()}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
        marginTop: spacing.md,
        paddingHorizontal: spacing.sm,
    },
    headerTitle: {


        letterSpacing: 2,
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },
    goldContainer: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 2,
    },
    goldText: {


    },
    filterContainer: {
        marginBottom: spacing.md,
        height: 50,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: '#444',
        justifyContent: 'center',
    },
    filterText: {


    },
    listContent: {
        paddingBottom: spacing.xl,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    itemCard: {
        width: '48%',
        marginBottom: spacing.md,
        padding: spacing.sm,
        alignItems: 'center',
        borderWidth: 2,
    },
    imageContainer: {
        width: '100%',
        height: 100,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    itemImage: {
        width: 80,
        height: 80,
    },
    itemEmoji: {

    },
    textContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 4,
    },
    itemName: {


        textAlign: 'center',
        marginBottom: 2,
        height: 40,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    itemType: {

        marginBottom: spacing.sm,
        textTransform: 'uppercase',
    },
    priceContainer: {
        marginBottom: spacing.sm,
    },
    priceText: {


    },
    buyButton: {
        width: '100%',
        paddingVertical: 8,
        borderRadius: 4,
        alignItems: 'center',
        borderWidth: 2,
    },
    buyButtonText: {


    },
});

export default ShopScreen;
