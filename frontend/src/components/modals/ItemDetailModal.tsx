import React from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import PixelCard from '../UI/Card';
import { getItemImage } from '../../config/itemImages';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ItemDetailModalProps {
    visible: boolean;
    item: any;
    onClose: () => void;
    onPurchase?: () => void;
    showPurchaseButton?: boolean;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
    visible,
    item,
    onClose,
    onPurchase,
    showPurchaseButton = false
}) => {
    const { theme } = useTheme();
    const { t, translateItem } = useLanguage();

    if (!item) return null;

    // Get item details from the JSON file
    const getItemDetails = () => {
        try {
            const itemDetails = require('../../config/itemDetails.json');
            return itemDetails.items[item.name] || {
                description: item.desc || 'No description available.',
                effects: [],
                rarity: item.rarity || 'common',
                type: item.type || 'unknown',
                flavor: 'A mysterious item with unknown properties.'
            };
        } catch (error) {
            console.error('Error loading item details:', error);
            return {
                description: item.desc || 'No description available.',
                effects: [],
                rarity: item.rarity || 'common',
                type: item.type || 'unknown',
                flavor: 'A mysterious item with unknown properties.'
            };
        }
    };

    const itemDetails = getItemDetails();

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'common': return theme.text;
            case 'uncommon': return '#4CAF50';
            case 'rare': return '#2196F3';
            case 'epic': return '#9C27B0';
            case 'legendary': return '#FF9800';
            default: return theme.text;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'weapon': return '⚔️';
            case 'armor': return '🛡️';
            case 'accessory': return '💍';
            case 'consumable': return '🧪';
            default: return '❓';
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.modalContainer, { backgroundColor: theme.surface }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.text }]}>
                            {translateItem(item.name) || item.name}
                        </Text>
                        <TouchableOpacity
                            style={[styles.closeButton, { backgroundColor: theme.secondary }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.closeButtonText, { color: theme.textLight }]}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Item Image and Basic Info */}
                        <View style={styles.itemHeader}>
                            <Image
                                source={getItemImage(item.image)}
                                style={styles.itemImage}
                                resizeMode="contain"
                            />
                            <View style={styles.itemInfo}>
                                <View style={styles.typeRarity}>
                                    <Text style={[styles.type, { color: theme.textSecondary }]}>
                                        {getTypeIcon(itemDetails.type)} {itemDetails.type}
                                    </Text>
                                    <Text style={[styles.rarity, { color: getRarityColor(itemDetails.rarity) }]}>
                                        {itemDetails.rarity.toUpperCase()}
                                    </Text>
                                </View>
                                {item.cost && (
                                    <Text style={[styles.cost, { color: theme.primary }]}>
                                        💰 {item.cost} gold
                                    </Text>
                                )}
                            </View>
                        </View>

                        {/* Description */}
                        <PixelCard style={styles.descriptionCard}>
                            <Text style={[styles.sectionTitle, { color: theme.primary }]}>
                                📖 Description
                            </Text>
                            <Text style={[styles.description, { color: theme.text }]}>
                                {itemDetails.description}
                            </Text>
                        </PixelCard>

                        {/* Effects */}
                        {itemDetails.effects && itemDetails.effects.length > 0 && (
                            <PixelCard style={styles.effectsCard}>
                                <Text style={[styles.sectionTitle, { color: theme.primary }]}>
                                    ✨ Effects
                                </Text>
                                {itemDetails.effects.map((effect: string, index: number) => (
                                    <Text key={index} style={[styles.effect, { color: theme.text }]}>
                                        • {effect}
                                    </Text>
                                ))}
                            </PixelCard>
                        )}

                        {/* Flavor Text */}
                        {itemDetails.flavor && (
                            <PixelCard style={styles.flavorCard}>
                                <Text style={[styles.sectionTitle, { color: theme.primary }]}>
                                    📜 Lore
                                </Text>
                                <Text style={[styles.flavor, { color: theme.textSecondary, fontStyle: 'italic' }]}>
                                    "{itemDetails.flavor}"
                                </Text>
                            </PixelCard>
                        )}

                        {/* Class Restrictions */}
                        {item.allowedClasses && item.allowedClasses.length > 0 && !item.allowedClasses.includes('all') && (
                            <PixelCard style={styles.classesCard}>
                                <Text style={[styles.sectionTitle, { color: theme.primary }]}>
                                    👥 Usable by
                                </Text>
                                <View style={styles.classesContainer}>
                                    {item.allowedClasses.map((className: string, index: number) => (
                                        <Text key={index} style={[styles.classChip, { backgroundColor: theme.secondary, color: theme.textLight }]}>
                                            {t[className] || className}
                                        </Text>
                                    ))}
                                </View>
                            </PixelCard>
                        )}
                    </ScrollView>

                    {/* Action Buttons */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.cancelButton, { backgroundColor: theme.secondary }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.cancelButtonText, { color: theme.textLight }]}>
                                {t.cancel || 'Cancel'}
                            </Text>
                        </TouchableOpacity>

                        {showPurchaseButton && onPurchase && (
                            <TouchableOpacity
                                style={[styles.purchaseButton, { backgroundColor: theme.primary }]}
                                onPress={onPurchase}
                            >
                                <Text style={[styles.purchaseButtonText, { color: theme.textLight }]}>
                                    💰 {t.purchase || 'Purchase'} ({item.cost} gold)
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
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
        padding: spacing.md,
    },
    modalContainer: {
        width: SCREEN_WIDTH * 0.9,
        maxHeight: '80%',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#333',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        marginRight: spacing.sm,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    content: {
        padding: spacing.md,
    },
    itemHeader: {
        flexDirection: 'row',
        marginBottom: spacing.md,
    },
    itemImage: {
        width: 80,
        height: 80,
        marginRight: spacing.md,
    },
    itemInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    typeRarity: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    type: {
        fontSize: 14,
        textTransform: 'capitalize',
    },
    rarity: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    cost: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    descriptionCard: {
        marginBottom: spacing.md,
        padding: spacing.md,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: spacing.sm,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
    },
    effectsCard: {
        marginBottom: spacing.md,
        padding: spacing.md,
    },
    effect: {
        fontSize: 14,
        marginBottom: spacing.sm,
        lineHeight: 18,
    },
    flavorCard: {
        marginBottom: spacing.md,
        padding: spacing.md,
    },
    flavor: {
        fontSize: 14,
        lineHeight: 18,
    },
    classesCard: {
        marginBottom: spacing.sm,
        padding: spacing.md,
    },
    classesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    classChip: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        padding: spacing.md,
        borderTopWidth: 1,
        borderTopColor: '#333',
        gap: spacing.sm,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        borderRadius: 6,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    purchaseButton: {
        flex: 2,
        paddingVertical: spacing.sm,
        borderRadius: 6,
        alignItems: 'center',
    },
    purchaseButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default ItemDetailModal;