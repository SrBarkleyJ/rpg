import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, RefreshControl, Image, Animated, Dimensions, Easing } from 'react-native';
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

const { width, height } = Dimensions.get('window');

interface Task {
    _id: string;
    title: string | { en: string; es: string;[key: string]: any };
    description?: string | { en: string; es: string;[key: string]: any };
    repeatType: 'daily' | 'weekly' | 'once';
    difficulty: number;
    rewardXP: number;
    rewardGold: number;
    category?: string;
    type: 'system' | 'user';
}

const ConfettiParticle = ({ delay, startX }: { delay: number; startX: number }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: 3000 + Math.random() * 2000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                    delay: delay
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true
                })
            ])
        ).start();
    }, []);

    const translateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-50, height + 50]
    });

    const rotate = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff', 'gold'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    return (
        <Animated.View
            style={{
                position: 'absolute',
                left: startX,
                top: 0,
                width: 10,
                height: 10,
                backgroundColor: color,
                transform: [{ translateY }, { rotate }],
                zIndex: 999
            }}
        />
    );
};

const TaskListScreen = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
    const [showConfetti, setShowConfetti] = useState(false);

    const { user, updateUser } = useAuth();
    const { theme } = useTheme();
    const { t, language } = useLanguage();

    const loadTasks = async () => {
        try {
            const data = await taskApi.getTasks();
            setTasks(data);
            checkDailyCompletion(data);
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
            return () => { setShowConfetti(false); }; // Cleanup confetti on leave
        }, [])
    );

    const checkDailyCompletion = (currentTasks) => {
        if (!user || !user.taskHistory) return;

        const dailyTasks = currentTasks.filter(t => t.repeatType === 'daily');
        if (dailyTasks.length === 0) return;

        const completedDailyCount = dailyTasks.filter(task => {
            const status = getTaskStatus(task, user); // Pass user explicitly to avoid stale closure if needed, though 'user' from hook should be fine
            return status.status === 'cooldown';
        }).length;

        if (completedDailyCount === dailyTasks.length && dailyTasks.length > 0) {
            setShowConfetti(true);
            // Hide confetti after 8 seconds
            setTimeout(() => setShowConfetti(false), 8000);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadTasks();
    };

    const handleCompleteTask = async (taskId) => {
        try {
            const result = await taskApi.completeTask(taskId);

            let updatedUser = user;
            if (result.user) {
                await updateUser(result.user);
                updatedUser = result.user; // Update local reference for check
            }

            let message = `${t.completed}💰 +${result.goldGained} ${t.gold}⭐+${result.xpGained} ${t.xp}`;

            if (result.leveledUp) {
                message += `LEVEL UP! ${t.level} ${result.newLevel}!`;
            }

            if (result.skillPointsAvailable && result.skillPointsAvailable > 0) {
                message += `✨ ${result.skillPointsAvailable} ${t.skillPoints} available!`;
            }

            Alert.alert(t.success, message);

            // Reload tasks and check completion
            const data = await taskApi.getTasks();
            setTasks(data);

            // Re-check completion with new data and updated user
            // We need to simulate the 'getTaskStatus' check with the NEW user data
            // But since 'user' in state might not be updated instantly in this closure, 
            // we should rely on the fresh data fetch or wait for effect.
            // For now, reloadTasks handles it.

            // Check daily completion specifically logic:
            // We need to check against the freshly fetched tasks and the RESULT user (which has new history)
            const dailyTasks = data.filter(t => t.repeatType === 'daily');
            const completedCount = dailyTasks.filter(task => {
                // Determine status manually here using updatedUser
                if (!updatedUser || !updatedUser.taskHistory) return false;
                const history = updatedUser.taskHistory.filter(h => h.taskId === task._id);
                history.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
                const lastCompletion = history[0];
                if (!lastCompletion) return false;
                const lastDate = new Date(lastCompletion.completedAt);
                const now = new Date();
                return lastDate.toDateString() === now.toDateString();
            }).length;

            if (dailyTasks.length > 0 && completedCount === dailyTasks.length) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 8000);
            }

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

    const getTaskStatus = (task, currentUser = user) => {
        if (!currentUser || !currentUser.taskHistory) return { status: 'available' };

        // Find history for this task
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
                // Calculate hours remaining
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

    const renderTask = ({ item }) => {
        try {
            if (!item) return null;

            const { status, timeRemaining } = getTaskStatus(item);
            const isCompleted = status === 'completed';
            const isCooldown = status === 'cooldown';
            const isDisabled = isCompleted || isCooldown;

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
                            <Text style={[styles.taskTitle, theme.typography.h3, { color: theme.text }]}>{title}</Text>
                            {/* Removed Badge from here as it's redundant with tabs */}
                        </View>
                        <View style={[styles.difficultyBadge, { borderColor: getDifficultyColor(item.difficulty) }]}>
                            <Text style={[styles.difficultyText, theme.typography.small, { color: getDifficultyColor(item.difficulty) }]}>
                                {t[difficultyLabel] || difficultyLabel.toUpperCase()}
                            </Text>
                        </View>
                    </View>

                    {description && (
                        <Text style={[styles.taskDescription, theme.typography.body, { color: theme.text }]}>{description}</Text>
                    )}

                    <View style={styles.rewardsContainer}>
                        <Text style={[styles.rewardText, theme.typography.bodyBold, { color: theme.text }]}>{t.reward}: </Text>
                        <Text style={[styles.xpText, theme.typography.bodyBold, { color: theme.secondary }]}>{item.rewardXP} {t.xp}</Text>
                        <Text style={[styles.goldText, theme.typography.bodyBold, { color: theme.warning }]}> | {item.rewardGold} {t.gold}</Text>
                    </View>

                    <TouchableOpacity
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
                            {isCooldown ? `⏳ ${timeRemaining}` : (isCompleted ? t.completed : t.complete)}
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
            <Text style={[theme.typography.body, { color: theme.text, marginTop: 20 }]}>{t.loading}</Text>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.centerContainer}>
            <Image source={SWORD_IMAGE} style={styles.placeholderImage} resizeMode="contain" />
            <Text style={[theme.typography.body, { color: theme.text, marginTop: 20 }]}>{t.noTasksAvailable}</Text>
        </View>
    );

    const filteredTasks = tasks.filter(task => {
        if (activeTab === 'daily') return task.repeatType === 'daily';
        if (activeTab === 'weekly') return task.repeatType === 'weekly';
        return true;
    });

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {showConfetti && (
                <View style={StyleSheet.absoluteFill} pointerEvents="none">
                    {[...Array(50)].map((_, i) => (
                        <ConfettiParticle key={i} delay={Math.random() * 1000} startX={Math.random() * width} />
                    ))}
                    <View style={[styles.centerContainer, { paddingTop: 100 }]}>
                        <Text style={[theme.typography.h1, { color: 'gold', fontSize: 40, textShadowRadius: 10, textShadowColor: 'black' }]}>
                            ALL CLEAR!
                        </Text>
                    </View>
                </View>
            )}

            <View style={styles.header}>
                <Text style={[styles.headerTitle, theme.typography.h1, { color: theme.textLight }]}>{t.tasksTitle}</Text>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'daily' && { backgroundColor: theme.primary, borderColor: theme.border }]}
                    onPress={() => setActiveTab('daily')}
                >
                    <Text style={[styles.tabText, activeTab === 'daily' ? { color: theme.textLight } : { color: theme.text }]}>
                        {t.daily}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'weekly' && { backgroundColor: theme.primary, borderColor: theme.border }]}
                    onPress={() => setActiveTab('weekly')}
                >
                    <Text style={[styles.tabText, activeTab === 'weekly' ? { color: theme.textLight } : { color: theme.text }]}>
                        {t.weekly}
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
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    badgeText: {
        color: 'white',
    },
    difficultyBadge: {
        borderWidth: 2,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    difficultyText: {
    },
    taskDescription: {
        marginTop: 9,
        marginBottom: spacing.sm,
        lineHeight: 23,
    },
    rewardsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    rewardText: {
    },
    xpText: {
    },
    goldText: {
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
    },
});

export default TaskListScreen;
