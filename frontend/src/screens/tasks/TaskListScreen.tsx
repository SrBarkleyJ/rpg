import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import taskApi from '../../api/taskApi';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import PixelCard from '../../components/UI/Card';

// Image import
import swordImage from '../../../assets/images/sword_basic.jpg';

// Placeholder image
const SWORD_IMAGE = swordImage;

const TaskListScreen = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user, updateUser } = useAuth();
    const { theme } = useTheme();
    const { t, language } = useLanguage();

    const loadTasks = async () => {
        try {
            const data = await taskApi.getTasks();
            setTasks(data);
        } catch (error) {
            console.error(error);
            Alert.alert(t.error, t.failedToLoadTasks);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadTasks();
            return () => { }; // Cleanup function
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadTasks();
    };

    const handleCompleteTask = async (taskId) => {
        try {
            const result = await taskApi.completeTask(taskId);
            console.log('Task completion result:', result);

            if (result.user) {
                await updateUser(result.user);
                console.log('User updated. Skill Points:', result.user.skillPoints);
            }

            let message = `${t.completed}!\\n💰 +${result.goldGained} ${t.gold}\\n⭐ +${result.xpGained} ${t.xp}`;

            if (result.leveledUp) {
                message += `\\n\\n🎉 LEVEL UP! ${t.level} ${result.newLevel}!`;
            }

            if (result.skillPointsAvailable && result.skillPointsAvailable > 0) {
                message += `\\n\\n✨ ${result.skillPointsAvailable} ${t.skillPoints} available!`;
            }

            Alert.alert(t.success, message);

            loadTasks();
        } catch (error) {
            console.error('Task completion error:', error);
            Alert.alert(t.error, error.response?.data?.message || t.failedToComplete);
        }
    };

    const getDifficultyLabel = (difficulty) => {
        if (typeof difficulty === 'number') {
            if (difficulty <= 1) return 'easy';
            if (difficulty === 2) return 'medium';
            return 'hard';
        }
        return difficulty || 'easy';
    };

    const getDifficultyColor = (difficulty) => {
        const label = getDifficultyLabel(difficulty);
        switch (label) {
            case 'easy': return theme.success;
            case 'medium': return theme.warning;
            case 'hard': return theme.danger;
            default: return theme.text;
        }
    };

    const renderTask = ({ item }) => {
        try {
            if (!item) return null;
            const isCompleted = user?.completedQuests?.includes(item._id);

            // Handle title translation safely
            let title = 'Untitled Task';
            if (item.title) {
                title = typeof item.title === 'object' ? (item.title[language] || item.title.en || 'Untitled') : item.title;
            }

            let description = '';
            if (item.description) {
                description = typeof item.description === 'object' ? (item.description[language] || item.description.en || '') : item.description;
            }

            const difficultyLabel = getDifficultyLabel(item.difficulty);

            return (
                <PixelCard style={[styles.taskCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <View style={styles.taskHeader}>
                        <View style={styles.titleContainer}>
                            <Text style={[styles.taskTitle, { color: theme.text }]}>{title}</Text>
                            {item.repeatType && (
                                <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                                    <Text style={styles.badgeText}>
                                        {item.repeatType === 'daily' ? t.daily : item.repeatType === 'weekly' ? t.weekly : t.once}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <View style={[styles.difficultyBadge, { borderColor: getDifficultyColor(item.difficulty) }]}>
                            <Text style={[styles.difficultyText, { color: getDifficultyColor(item.difficulty) }]}>
                                {difficultyLabel.toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    {description && (
                        <Text style={[styles.taskDescription, { color: theme.text }]}>{description}</Text>
                    )}

                    <View style={styles.rewardsContainer}>
                        <Text style={[styles.rewardText, { color: theme.text }]}>{t.reward}: </Text>
                        <Text style={[styles.xpText, { color: theme.secondary }]}>{item.rewardXP} {t.xp}</Text>
                        <Text style={[styles.goldText, { color: theme.warning }]}> | {item.rewardGold} {t.gold}</Text>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.completeButton,
                            { backgroundColor: isCompleted ? theme.border : theme.success, borderColor: theme.border },
                            isCompleted && styles.completedButton
                        ]}
                        onPress={() => handleCompleteTask(item._id)}
                        disabled={isCompleted}
                    >
                        <Text style={[styles.buttonText, { color: theme.textLight }]}>
                            {isCompleted ? t.completed : t.complete}
                        </Text>
                    </TouchableOpacity>
                </PixelCard>
            );
        } catch (error) {
            console.error('Error rendering task item:', error);
            return null;
        }
    };

    const renderLoading = () => (
        <View style={styles.centerContainer}>
            <Image source={SWORD_IMAGE} style={styles.placeholderImage} resizeMode="contain" />
            <Text style={{ color: theme.text, marginTop: 20 }}>{t.loading}</Text>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.centerContainer}>
            <Image source={SWORD_IMAGE} style={styles.placeholderImage} resizeMode="contain" />
            <Text style={{ color: theme.text, marginTop: 20 }}>{t.noTasksAvailable}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.textLight }]}>{t.tasksTitle}</Text>
            </View>

            {loading ? (
                renderLoading()
            ) : (
                <FlatList
                    data={Array.isArray(tasks) ? tasks : []}
                    keyExtractor={(item) => item?._id || Math.random().toString()}
                    renderItem={renderTask}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={renderEmpty}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />
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
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    placeholderImage: {
        width: 100,
        height: 100,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.lg,
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
    listContent: {
        paddingBottom: spacing.xl,
    },
    taskCard: {
        marginBottom: spacing.md,
        padding: spacing.md,
        borderWidth: 2,
    },
    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    titleContainer: {
        flex: 1,
        marginRight: spacing.sm,
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    difficultyBadge: {
        borderWidth: 2,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    difficultyText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    taskDescription: {
        fontSize: 14,
        marginBottom: spacing.sm,
        lineHeight: 20,
    },
    rewardsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    rewardText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    xpText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    goldText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    completeButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 4,
        borderWidth: 2,
        alignItems: 'center',
    },
    completedButton: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TaskListScreen;
