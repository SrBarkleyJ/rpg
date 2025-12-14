import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, RefreshControl, Image, Dimensions } from 'react-native';
import Reanimated, { Layout } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import taskApi from '../../api/taskApi';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import PixelCard from '../../components/UI/Card';
import { hapticSuccess } from '../../utils/haptics';
import AnimatedPressable from '../../components/UI/AnimatedPressable';
import TaskListSkeleton from '../../components/skeletons/TaskListSkeleton';

// Image import
import swordImage from '../../../assets/images/sword_basic.jpg';

// Placeholder image
const SWORD_IMAGE = swordImage;

const { width, height } = Dimensions.get('window');

interface Task {
    _id: string;
    title: string | { en: string; es: string; [key: string]: any };
    description?: string | { en: string; es: string; [key: string]: any };
    repeatType: 'daily' | 'weekly' | 'once';
    difficulty: number;
    rewardXP: number;
    rewardGold: number;
    category?: string;
    type: 'system' | 'user';
}

interface TaskStatus {
    status: 'available' | 'cooldown' | 'completed';
    timeRemaining?: string;
}

const TaskListScreen = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

    const { user, updateUser } = useAuth();
    const { theme } = useTheme();
    const { t, language } = useLanguage();

    const checkDailyCompletion = useCallback((currentTasks: Task[]) => {
        if (!user || !user.taskHistory) return;

        const dailyTasks = currentTasks.filter(t => t.repeatType === 'daily');
        if (dailyTasks.length === 0) return;

        const completedDailyCount = dailyTasks.filter(task => {
            const status = getTaskStatus(task, user);
            return status.status === 'cooldown';
        }).length;
        
        // Aquí puedes añadir lógica adicional si es necesario
        console.log(`Daily tasks completed: ${completedDailyCount}/${dailyTasks.length}`);
    }, [user]);

    const loadTasks = async () => {
        try {
            const data = await taskApi.getTasks();
            setTasks(data);
            checkDailyCompletion(data);
        } catch (error) {
            console.error('Error loading tasks:', error);
            Alert.alert(t.error, t.failedToLoadTasks || 'Failed to load tasks');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (!refreshing) {
                loadTasks();
            }
        }, [refreshing])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadTasks();
    };

    const handleCompleteTask = async (taskId: string) => {
        try {
            const result = await taskApi.completeTask(taskId);

            let updatedUser = user;
            if (result.user) {
                await updateUser(result.user);
                updatedUser = result.user;
            }

            hapticSuccess();

            let message = `${t.completed || 'Completed'}💰 +${result.goldGained} ${t.gold || 'Gold'}⭐+${result.xpGained} ${t.xp || 'XP'}`;

            if (result.leveledUp) {
                message += ` LEVEL UP! ${t.level || 'Level'} ${result.newLevel}!`;
            }

            if (result.skillPointsAvailable && result.skillPointsAvailable > 0) {
                message += ` ✨ ${result.skillPointsAvailable} ${t.skillPoints || 'Skill Points'} available!`;
            }

            Alert.alert(t.success || 'Success', message);

            const data = await taskApi.getTasks();
            setTasks(data);

            // Check daily completion
            const dailyTasks = data.filter(t => t.repeatType === 'daily');
            const completedCount = dailyTasks.filter(task => {
                if (!updatedUser || !updatedUser.taskHistory) return false;
                const history = updatedUser.taskHistory.filter(h => h.taskId === task._id);
                history.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
                const lastCompletion = history[0];
                if (!lastCompletion) return false;
                const lastDate = new Date(lastCompletion.completedAt);
                const now = new Date();
                return lastDate.toDateString() === now.toDateString();
            }).length;

            console.log(`Daily tasks completed: ${completedCount}/${dailyTasks.length}`);

        } catch (error: any) {
            console.error('Task completion error:', error);
            Alert.alert(t.error || 'Error', error.response?.data?.message || t.failedToComplete || 'Failed to complete task');
        }
    };

    const getDifficultyLabel = (difficulty: number): string => {
        if (difficulty <= 1) return 'easy';
        if (difficulty === 2) return 'medium';
        return 'hard';
    };

    const getDifficultyColor = (difficulty: number): string => {
        const label = getDifficultyLabel(difficulty);
        switch (label) {
            case 'easy': return theme.success || '#4CAF50';
            case 'medium': return theme.warning || '#FF9800';
            case 'hard': return theme.danger || '#F44336';
            default: return theme.text || '#000000';
        }
    };

    const getTaskStatus = (task: Task, currentUser = user): TaskStatus => {
        if (!currentUser || !currentUser.taskHistory) return { status: 'available' };

        const history = currentUser.taskHistory.filter(h => h.taskId === task._id);
        history.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
        const lastCompletion = history[0];

        if (task.repeatType === 'once') {
            const isCompleted = currentUser.completedQuests?.includes(task._id) || !!lastCompletion;
            return { status: isCompleted ? 'completed' : 'available' };
        } else if (task.repeatType === 'daily') {
            if (!lastCompletion) return { status: 'available' };

            const lastDate = new Date(lastCompletion.completedAt);
            const now = new Date();

            if (lastDate.toDateString() === now.toDateString()) {
                const tomorrow = new Date(now);
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(0, 0, 0, 0);
                const msRemaining = tomorrow.getTime() - now.getTime();
                const hours = Math.ceil(msRemaining / (1000 * 60 * 60));
                return { status: 'cooldown', timeRemaining: `${hours}h` };
            }
            return { status: 'available' };
        } else if (task.repeatType === 'weekly') {
            if (!lastCompletion) return { status: 'available' };
            const lastDate = new Date(lastCompletion.completedAt);
            const now = new Date();
            const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
            if (now.getTime() - lastDate.getTime() < oneWeekMs) {
                return { status: 'cooldown', timeRemaining: '7d' };
            }
            return { status: 'available' };
        }
        return { status: 'available' };
    };

    const renderTask = ({ item }: { item: Task }) => {
        try {
            if (!item) return null;

            const { status, timeRemaining } = getTaskStatus(item);
            const isCompleted = status === 'completed';
            const isCooldown = status === 'cooldown';
            const isDisabled = isCompleted || isCooldown;

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
                <Reanimated.View layout={Layout.springify()}>
                    <PixelCard style={[styles.taskCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <View style={styles.taskHeader}>
                            <View style={styles.titleContainer}>
                                <Text style={[styles.taskTitle, theme.typography.h3, { color: theme.text }]}>{title}</Text>
                            </View>
                            <View style={[styles.difficultyBadge, { borderColor: getDifficultyColor(item.difficulty) }]}>
                                <Text style={[styles.difficultyText, theme.typography.small, { color: getDifficultyColor(item.difficulty) }]}>
                                    {t[difficultyLabel] || difficultyLabel.toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        {description ? (
                            <Text style={[styles.taskDescription, theme.typography.body, { color: theme.text }]}>{description}</Text>
                        ) : null}

                        <View style={styles.rewardsContainer}>
                            <Text style={[styles.rewardText, theme.typography.bodyBold, { color: theme.text }]}>{t.reward || 'Reward'}: </Text>
                            <Text style={[styles.xpText, theme.typography.bodyBold, { color: theme.secondary }]}>{item.rewardXP} {t.xp || 'XP'}</Text>
                            <Text style={[styles.goldText, theme.typography.bodyBold, { color: theme.warning }]}>{item.rewardGold} {t.gold || 'Gold'}</Text>
                        
                        </View>

                        <AnimatedPressable
                            style={[
                                styles.completeButton,
                                {
                                    backgroundColor: isDisabled ? theme.border : theme.success,
                                    borderColor: theme.border
                                },
                                isDisabled && styles.completedButton
                            ]}
                            onPress={() => handleCompleteTask(item._id)}
                            disabled={isDisabled}
                        >
                            <Text style={[styles.buttonText, theme.typography.h3, { color: theme.textLight }]}>
                                {isCooldown ? `⏳ ${timeRemaining}` : (isCompleted ? t.completed || 'Completed' : t.complete || 'Complete')}
                            </Text>
                        </AnimatedPressable>
                    </PixelCard>
                </Reanimated.View>
            );
        } catch (error) {
            console.error('Error rendering task item:', error);
            return null;
        }
    };

    const renderLoading = () => (
        <TaskListSkeleton />
    );

    const renderEmpty = () => (
        <View style={styles.centerContainer}>
            <Image source={SWORD_IMAGE} style={styles.placeholderImage} resizeMode="contain" />
            <Text style={[theme.typography.body, { color: theme.text, marginTop: 20 }]}>{t.noTasksAvailable || 'No tasks available'}</Text>
        </View>
    );

    const filteredTasks = tasks.filter(task => {
        if (activeTab === 'daily') return task.repeatType === 'daily';
        if (activeTab === 'weekly') return task.repeatType === 'weekly';
        return true;
    });

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, theme.typography.h1, { color: theme.textLight }]}>{t.tasksTitle || 'Tasks'}</Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'daily' && { backgroundColor: theme.primary, borderColor: theme.border }]}
                    onPress={() => setActiveTab('daily')}
                >
                    <Text style={[styles.tabText, activeTab === 'daily' ? { color: theme.textLight } : { color: theme.text }]}>
                        {t.daily || 'Daily'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'weekly' && { backgroundColor: theme.primary, borderColor: theme.border }]}
                    onPress={() => setActiveTab('weekly')}
                >
                    <Text style={[styles.tabText, activeTab === 'weekly' ? { color: theme.textLight } : { color: theme.text }]}>
                        {t.weekly || 'Weekly'}
                    </Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                renderLoading()
            ) : (
                <FlatList
                    data={filteredTasks}
                    keyExtractor={(item) => item?._id || Math.random().toString()}
                    renderItem={renderTask}
                    contentContainerStyle={[styles.listContent, { paddingBottom: 90 }]}
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
        marginBottom: spacing.md,
        marginTop: spacing.sm,
    },
    headerTitle: {
        letterSpacing: 2,
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: spacing.md,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#ccc',
        overflow: 'hidden'
    },
    tabButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontWeight: 'bold',
        fontSize: 16
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
        marginBottom: 8,
    },
    difficultyBadge: {
        borderWidth: 2,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    difficultyText: {
        // Styling is handled by theme
    },
    taskDescription: {
        marginTop: 9,
        marginBottom: spacing.sm,
        lineHeight: 23,
    },
    rewardsContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    rewardText: {
        // Styling is handled by theme
    },
    xpText: {
        // Styling is handled by theme
    },
    goldText: {
        // Styling is handled by theme
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
        // Styling is handled by theme
    },
});

export default TaskListScreen;