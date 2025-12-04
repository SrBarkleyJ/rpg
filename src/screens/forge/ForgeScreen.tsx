import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { getForgeableItems, forgeItem } from '../../api/forgeApi';
import PixelCard from '../../components/UI/Card';

// Image imports
import healthPotionImage from '../../../assets/images/health_potion.jpg';
import manaPotionImage from '../../../assets/images/mana_potion.jpg';
import swordBasicImage from '../../../assets/images/sword_basic.jpg';
import shieldBasicImage from '../../../assets/images/shield_basic.jpg';
import ironSwordImage from '../../../assets/images/iron_sword.png';
import leatherArmorImage from '../../../assets/images/leather_armor.png';
import chainmailArmorImage from '../../../assets/images/chainmail_armor.png';
import swiftBootsImage from '../../../assets/images/swift_boots.png';
import luckyCharmImage from '../../../assets/images/lucky_charm.png';
import ringOfPowerImage from '../../../assets/images/ring_of_power.png';
import battleAxeImage from '../../../assets/images/battle_axe.png';
import steelSwordImage from '../../../assets/images/steel_sword.png';
import ironShieldImage from '../../../assets/images/iron_shield.png';
import wornDaggerImage from '../../../assets/images/worn_dagger.png';
import sharpDaggerImage from '../../../assets/images/sharp_dagger.png';
import twinBladesImage from '../../../assets/images/twin_blades.png';
import shadowstrikeImage from '../../../assets/images/shadowstrike.png';
import woodenStaffImage from '../../../assets/images/wooden_staff.png';
import emberStaffImage from '../../../assets/images/ember_staff.png';
import crystalStaffImage from '../../../assets/images/crystal_staff.png';
import godStaffImage from '../../../assets/images/god_staff.png';


// Image mapping by key
const ITEM_IMAGES: { [key: string]: any } = {
    'health_potion': healthPotionImage,
    'mana_potion': manaPotionImage,
    'sword_basic': swordBasicImage,
    'shield_basic': shieldBasicImage,
    'iron_sword': ironSwordImage,
    'steel_sword': steelSwordImage,
    'battle_axe': battleAxeImage,
    'iron_shield': ironShieldImage,
    'worn_dagger': wornDaggerImage,
    'sharp_dagger': sharpDaggerImage,
    'twin_blades': twinBladesImage,
    'shadowstrike': shadowstrikeImage,
    'wooden_staff': woodenStaffImage,
    'ember_staff': emberStaffImage,
    'crystal_staff': crystalStaffImage,
    'god_staff': godStaffImage,
    'leather_armor': leatherArmorImage,
    'chainmail_armor': chainmailArmorImage,
    'swift_boots': swiftBootsImage,
    'lucky_charm': luckyCharmImage,
    'ring_of_power': ringOfPowerImage,
};

// Helper to get image based on image key from database
const getItemImage = (imageKey: string) => {
    return ITEM_IMAGES[imageKey] || swordBasicImage; // Fallback to basic sword
};

const ForgeScreen = () => {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<any[]>([]);
    const [tetranuta, setTetranuta] = useState(0);
    const [processing, setProcessing] = useState(false);

    const loadForge = async () => {
        try {
            setLoading(true);
            const data = await getForgeableItems();
            setItems(data.items);
            setTetranuta(data.tetranuta);
        } catch (error) {
            console.error(error);
            Alert.alert(t.error, t.failedToLoadInventory);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadForge();
        }, [])
    );

    const handleForge = async (inventoryId: string, cost: number) => {
        if (tetranuta < cost) {
            Alert.alert(t.error, `Not enough Tetranuta! Need ${cost}.`);
            return;
        }

        try {
            setProcessing(true);
            const response = await forgeItem(inventoryId);
            Alert.alert(t.success, t.forgeSuccess);

            // Update local state
            setTetranuta(response.user.tetranuta);
            loadForge(); // Reload to refresh list
        } catch (error: any) {
            Alert.alert(t.error, error.message || t.failedToPerformAction);
        } finally {
            setProcessing(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const currentLevel = item.currentLevel || 0;
        const isMaxLevel = currentLevel >= 10;

        return (
            <PixelCard style={styles.card}>
                <View style={styles.cardContent}>
                    <View style={styles.itemHeader}>
                        <Image source={getItemImage(item.image)} style={styles.itemImage} />
                        <View style={styles.itemInfo}>
                            <Text style={[styles.itemName, { color: theme.text }]}>
                                {item.name} {currentLevel > 0 && <Text style={{ color: theme.text }}>+{currentLevel}</Text>}
                            </Text>
                            <Text style={[styles.itemRarity, { color: theme.text }]}>
                                {t.current}: Level {currentLevel}/10
                            </Text>
                        </View>
                    </View>

                    {!isMaxLevel ? (
                        <>
                            <View style={styles.upgradeInfo}>
                                <Text style={[styles.nextTier, { color: theme.text }]}>
                                    {t.next}: +{item.nextLevel}
                                </Text>
                                <Text style={[styles.cost, { color: theme.text }]}>
                                    {t.cost}: {item.forgeCost} ⚒️
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.forgeButton,
                                    { backgroundColor: theme.primary, opacity: (tetranuta >= item.forgeCost && !processing) ? 1 : 0.5 }
                                ]}
                                onPress={() => handleForge(item.inventoryId, item.forgeCost)}
                                disabled={tetranuta < item.forgeCost || processing}
                            >
                                {processing ? (
                                    <ActivityIndicator color="#FFF" size="small" />
                                ) : (
                                    <Text style={styles.forgeButtonText}>{t.forgeButton}</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View style={styles.maxLevelContainer}>
                            <Text style={[styles.maxLevelText, { color: theme.text }]}>
                                ✨ MAX LEVEL ✨
                            </Text>
                        </View>
                    )}
                </View>
            </PixelCard>
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.primary }]}>{t.forgeTitle}</Text>
                <View style={styles.resourceContainer}>
                    <Text style={[styles.resourceText, { color: theme.text }]}>⚒️ {tetranuta}</Text>
                </View>
            </View>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{t.forgeDesc}</Text>

            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.inventoryId}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>{t.noForgeable}</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 20,
    },
    resourceContainer: {
        backgroundColor: 'rgba(70, 1, 1, 0.2)',
        padding: 8,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#555',
    },
    resourceText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        marginBottom: 16,
        padding: 12,
        height: 350,
        justifyContent: 'center',
    },
    cardContent: {
        flexDirection: 'column',
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemImage: {
        width: 120,
        height: 230,
        marginRight: 16,
    },
    itemInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    itemRarity: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    arrowContainer: {
        alignItems: 'center',
        marginVertical: 4,
    },
    arrow: {
        fontSize: 20,
    },
    upgradeInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 8,
    },
    nextTier: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cost: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    forgeButton: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    forgeButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    },
    maxLevelContainer: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    maxLevelText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ForgeScreen;
