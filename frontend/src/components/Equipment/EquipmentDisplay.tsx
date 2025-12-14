import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import PixelCard from '../UI/Card';
import { getItemImage } from '../../config/itemImages';

interface EquipmentDisplayProps {
    equipment: {
        mainhand?: any;
        offhand?: any;
        helmet?: any;
        chest?: any;
        ring1?: any;
        ring2?: any;
        ring3?: any;
        ring4?: any;
        amulet?: any;
    };
    onEquipmentPress?: (slot: string) => void;
}

/**
 * Display equipment slots in Dark Souls style
 * Shows equipped items with their details
 */
const EquipmentDisplay: React.FC<EquipmentDisplayProps> = ({ equipment, onEquipmentPress }) => {
    const { theme } = useTheme();
    const { t } = useLanguage();

    const getSlotLabel = (slot: string): string => {
        const labels: Record<string, string> = {
            mainhand: 'Right Hand',
            offhand: 'Left Hand',
            helmet: t.helmet || 'Helmet',
            chest: t.armor || 'Armor',
            ring1: 'Ring 1',
            ring2: 'Ring 2',
            ring3: 'Ring 3',
            ring4: 'Ring 4',
            amulet: t.amulet || 'Amulet',
        };
        return labels[slot] || slot;
    };

    const renderEquipmentSlot = (slot: string, item: any) => {
        const itemImage = item?.itemDetails?.image
            ? getItemImage(item.itemDetails.image)
            : null;

        const isRing = slot.startsWith('ring');
        const size = isRing ? 60 : 80;

        return (
            <TouchableOpacity
                key={slot}
                style={[
                    styles.slotContainer,
                    {
                        backgroundColor: theme.surface,
                        borderColor: item?.itemId ? theme.primary : theme.border,
                        width: isRing ? size + 20 : size + 40,
                        minHeight: isRing ? size : size + 30,
                    },
                ]}
                onPress={() => onEquipmentPress?.(slot)}
                disabled={!onEquipmentPress}
            >
                {item?.itemId ? (
                    <>
                        <View style={[styles.imageContainer, { width: size, height: size }]}>
                            {itemImage ? (
                                <Image
                                    source={itemImage}
                                    style={{ width: size, height: size }}
                                    resizeMode="contain"
                                />
                            ) : (
                                <Text style={[styles.emoji, { fontSize: size / 2 }]}>
                                    {isRing ? '💍' : '🛡️'}
                                </Text>
                            )}
                        </View>
                        {!isRing && (
                            <Text
                                style={[
                                    styles.itemName,
                                    theme.typography.caption,
                                    { color: theme.text, marginTop: spacing.sm },
                                ]}
                                numberOfLines={2}
                            >
                                {item.itemDetails?.name}
                            </Text>
                        )}
                    </>
                ) : (
                    <Text style={[styles.emptySlot, { fontSize: isRing ? 24 : 32, color: theme.text }]}>
                        {isRing ? '⭕' : '❌'}
                    </Text>
                )}
                <Text
                    style={[
                        styles.slotLabel,
                        theme.typography.caption,
                        { color: theme.textSecondary, fontSize: 10 },
                    ]}
                >
                    {getSlotLabel(slot)}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <PixelCard style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.title, theme.typography.h3, { color: theme.text, marginBottom: spacing.md }]}>
                ⚔️ Equipment
            </Text>

            {/* Main Hand / Off Hand */}
            <View style={styles.row}>
                <Text style={[styles.rowLabel, theme.typography.small, { color: theme.text }]}>Weapons</Text>
                <View style={styles.slotsRow}>
                    {renderEquipmentSlot('mainhand', equipment?.mainhand)}
                    {renderEquipmentSlot('offhand', equipment?.offhand)}
                </View>
            </View>

            {/* Armor */}
            <View style={[styles.row, { marginTop: spacing.md }]}>
                <Text style={[styles.rowLabel, theme.typography.small, { color: theme.text }]}>Armor</Text>
                <View style={styles.slotsRow}>
                    {renderEquipmentSlot('helmet', equipment?.helmet)}
                    {renderEquipmentSlot('chest', equipment?.chest)}
                </View>
            </View>

            {/* Rings (Dark Souls Style - 4 slots) */}
            <View style={[styles.row, { marginTop: spacing.md }]}>
                <Text style={[styles.rowLabel, theme.typography.small, { color: theme.text }]}>Rings</Text>
                <View style={styles.ringsGrid}>
                    {renderEquipmentSlot('ring1', equipment?.ring1)}
                    {renderEquipmentSlot('ring2', equipment?.ring2)}
                    {renderEquipmentSlot('ring3', equipment?.ring3)}
                    {renderEquipmentSlot('ring4', equipment?.ring4)}
                </View>
            </View>

            {/* Accessories */}
            <View style={[styles.row, { marginTop: spacing.md }]}>
                <Text style={[styles.rowLabel, theme.typography.small, { color: theme.text }]}>Accessories</Text>
                <View style={styles.slotsRow}>
                    {renderEquipmentSlot('amulet', equipment?.amulet)}
                </View>
            </View>
        </PixelCard>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.md,
        borderWidth: 2,
        marginVertical: spacing.md,
    },
    title: {
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    row: {
        marginBottom: spacing.sm,
    },
    rowLabel: {
        fontWeight: 'bold',
        marginBottom: spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    slotsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: spacing.sm,
        flexWrap: 'wrap',
    },
    ringsGrid: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: spacing.sm,
        flexWrap: 'wrap',
    },
    slotContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 4,
        padding: spacing.sm,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
    },
    emoji: {
        fontSize: 32,
    },
    emptySlot: {
        fontWeight: 'bold',
    },
    itemName: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginHorizontal: spacing.sm,
    },
    slotLabel: {
        marginTop: spacing.sm,
        fontWeight: '600',
        textAlign: 'center',
        width: '100%',
    },
});

export default EquipmentDisplay;
