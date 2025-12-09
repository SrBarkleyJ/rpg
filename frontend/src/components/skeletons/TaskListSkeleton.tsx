import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from '../UI/Skeleton';
import PixelCard from '../UI/Card';
import { spacing } from '../../theme/spacing';
import { useTheme } from '../../context/ThemeContext';

const TaskItemSkeleton = () => {
    const { theme } = useTheme();
    return (
        <PixelCard style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.header}>
                <Skeleton width="60%" height={20} />
                <Skeleton width={60} height={20} />
            </View>
            <Skeleton width="100%" height={14} style={{ marginTop: 10, marginBottom: 10 }} />
            <Skeleton width="80%" height={14} style={{ marginBottom: 15 }} />
            <View style={styles.footer}>
                <Skeleton width={120} height={16} />
                <Skeleton width={100} height={40} borderRadius={4} />
            </View>
        </PixelCard>
    );
};

const TaskListSkeleton = () => {
    return (
        <View>
            <TaskItemSkeleton />
            <TaskItemSkeleton />
            <TaskItemSkeleton />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: spacing.md,
        padding: spacing.md,
        borderWidth: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.sm,
    }
});

export default TaskListSkeleton;
