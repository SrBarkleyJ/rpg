import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from '../UI/Skeleton';
import PixelCard from '../UI/Card';
import { spacing } from '../../theme/spacing';
import { useTheme } from '../../context/ThemeContext';

const ProfileSkeleton = () => {
    const { theme } = useTheme();

    return (
        <PixelCard style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.header}>
                <Skeleton width={120} height={120} borderRadius={60} style={{ marginBottom: spacing.md }} />
                <Skeleton width={150} height={24} style={{ marginBottom: 8 }} />
                <Skeleton width={100} height={16} style={{ marginBottom: 8 }} />
                <Skeleton width={80} height={16} />
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Skeleton width={40} height={24} style={{ marginBottom: 4 }} />
                    <Skeleton width={30} height={12} />
                </View>
                <View style={styles.statItem}>
                    <Skeleton width={40} height={24} style={{ marginBottom: 4 }} />
                    <Skeleton width={30} height={12} />
                </View>
            </View>
        </PixelCard>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: spacing.md,
        borderWidth: 2,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    divider: {
        height: 2,
        marginVertical: spacing.md,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
});

export default ProfileSkeleton;
