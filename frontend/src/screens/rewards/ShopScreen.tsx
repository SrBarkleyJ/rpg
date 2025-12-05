import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import rewardApi from '../../api/rewardApi';
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
import battleAxeImage from '../../../assets/images/battle_axe.png';
import woodenStaffImage from '../../../assets/images/wooden_staff.png';
import wornDaggerImage from '../../../assets/images/worn_dagger.png';
// New weapon tiers
import steelSwordImage from '../../../assets/images/steel_sword.png';
import ironShieldImage from '../../../assets/images/iron_shield.png';
import sharpDaggerImage from '../../../assets/images/sharp_dagger.png';
import twinBladesImage from '../../../assets/images/twin_blades.png';
import shadowstrikeImage from '../../../assets/images/shadowstrike.png';
import emberStaffImage from '../../../assets/images/ember_staff.png';
import crystalStaffImage from '../../../assets/images/crystal_staff.png';
import godStaffImage from '../../../assets/images/god_staff.png';

// Item images mapping
const ITEM_IMAGES = {
    'health_potion': healthPotionImage,
    'mana_potion': manaPotionImage,
    'sword_basic': swordBasicImage,
    'shield_basic': shieldBasicImage,
    'helmet_basic': helmetBasicImage,
    'boots_basic': bootsBasicImage,
    'iron_sword': ironSwordImage,
    'steel_sword': steelSwordImage,
    'battle_axe': battleAxeImage,
    'iron_shield': ironShieldImage,
    'leather_armor': leatherArmorImage,
    'chainmail_armor': chainmailArmorImage,
    'lucky_charm': luckyCharmImage,
    'swift_boots': swiftBootsImage,
    'ring_of_power': ringOfPowerImage,
    'worn_dagger': wornDaggerImage,
    'sharp_dagger': sharpDaggerImage,
    'twin_blades': twinBladesImage,
    'shadowstrike': shadowstrikeImage,
    'wooden_staff': woodenStaffImage,
    'ember_staff': emberStaffImage,
    'crystal_staff': crystalStaffImage,
    'god_staff': godStaffImage,
};

const ShopScreen = () => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');
    const { user, updateUser } = useAuth();
    const { theme } = useTheme();
    const { t, language } = useLanguage();

    const categories = ['All', 'Consumable', 'Warrior', 'Mage', 'Rogue', 'Armor', 'Accessory'];

    useEffect(() => {
        loadItems();
    }, []);

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
                Alert.alert(t.success, `${t.buySuccess} ${item.name}!`);
            }
        } catch (error) {
            console.error(error);
            Alert.alert(t.error, t.failedToPurchase);
        }
    };

    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'common': return '#b0b0b0'; // Lighter grey for better visibility on dark
            case 'uncommon': return '#4caf50';
            case 'rare': return '#42a5f5'; // Lighter blue
            case 'epic': return '#ab47bc'; // Lighter purple
            case 'legendary': return '#ffa726'; // Lighter orange
            default: return theme.text;
        }
    };

    const getItemImage = (imageKey: string) => {
        return ITEM_IMAGES[imageKey] || null;
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
        const name = item.name;
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
                        <Text style={styles.itemEmoji}>
                            {item.type === 'weapon' ? '⚔️' :
                                item.type === 'armor' ? '🛡️' :
                                    item.type === 'accessory' ? '💍' :
                                        '🧪'}
                        </Text>
                    )}
                </View>

                <View style={styles.textContainer}>
                    <Text style={[styles.itemName, { color: getRarityColor(item.rarity) }]}>{name}</Text>
                    <Text style={[styles.itemType, { color: theme.text, opacity: 0.7 }]}>{item.type}</Text>
                </View>

                <View style={styles.priceContainer}>
                    <Text style={[styles.priceText, { color: theme.warning }]}>{item.cost} {t.gold}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.buyButton, { backgroundColor: theme.primary, borderColor: theme.border }]}
                    onPress={() => handleBuyItem(item)}
                >
                    <Text style={[styles.buyButtonText, { color: theme.textLight }]}>{t.buy}</Text>
                </TouchableOpacity>
            </PixelCard>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.textLight }]}>{t.shopTitle}</Text>
                <View style={[styles.goldContainer, { backgroundColor: theme.surface, borderColor: theme.warning }]}>
                    <Text style={[styles.goldText, { color: theme.warning }]}>💰 {user?.gold || 0}</Text>
                </View>
            </View>

            <View style={styles.filterContainer}>
                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.filterButton,
                                category === item && { backgroundColor: theme.primary, borderColor: theme.warning },
                                { borderColor: theme.border }
                            ]}
                            onPress={() => setCategory(item)}
                        >
                            <Text style={[
                                styles.filterText,
                                category === item ? { color: theme.textLight } : { color: theme.textLight }
                            ]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {loading ? (
                <Text style={{ color: theme.textLight, textAlign: 'center', marginTop: 20 }}>{t.loading}</Text>
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
        fontSize: 24,
        fontWeight: 'bold',
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
        fontWeight: 'bold',
        fontSize: 16,
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
        fontWeight: 'bold',
        fontSize: 14,
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
        fontSize: 40,
    },
    textContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 4,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
        height: 40,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    itemType: {
        fontSize: 12,
        marginBottom: spacing.sm,
        textTransform: 'uppercase',
    },
    priceContainer: {
        marginBottom: spacing.sm,
    },
    priceText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    buyButton: {
        width: '100%',
        paddingVertical: 8,
        borderRadius: 4,
        alignItems: 'center',
        borderWidth: 2,
    },
    buyButtonText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default ShopScreen;
