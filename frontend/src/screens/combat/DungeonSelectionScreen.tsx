import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import combatApi from '../../api/combatApi';

import DifficultyIndicator from '../../components/combat/DifficultyIndicator';

interface Dungeon {
    _id: string;
    name: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'very-hard' | 'extreme';
    requiredLevel: number;
    enemyCount: number;
    rewards: {
        gold: number;
        xp: number;
        tetranuta: number;
    };
    inProgress: boolean;
    currentEnemy: number;
}

interface DungeonSelectionScreenProps {
    onDungeonSelected: (dungeonId: string) => void;
    onBack: () => void;
}

const DungeonSelectionScreen: React.FC<DungeonSelectionScreenProps> = ({ onDungeonSelected, onBack }) => {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [dungeons, setDungeons] = useState<Dungeon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDungeons();
    }, []);

    const loadDungeons = async () => {
        try {
            setLoading(true);
            const data = await combatApi.getDungeons();
            setDungeons(data.dungeons);
        } catch (error: any) {
            console.error('Error loading dungeons:', error);
            Alert.alert('Error', 'Failed to load dungeons');
        } finally {
            setLoading(false);
        }
    };

    const renderDungeon = ({ item }: { item: Dungeon }) => (
        <View style={[styles.dungeonCard, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 2, borderRadius: 8, padding: 16 }]}>
            <View style={styles.dungeonHeader}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.dungeonName, { color: theme.text }]}>{item.name}</Text>
                    <Text style={[styles.dungeonLevel, { color: theme.secondary }]}>
                        Level {item.requiredLevel}+ • {item.enemyCount} Enemies
                    </Text>
                </View>
                <DifficultyIndicator difficulty={item.difficulty} showIcon />
            </View>

            {item.inProgress && (
                <View style={[styles.progressBadge, { backgroundColor: theme.warning }]}>
                    <Text style={styles.progressText}>
                        IN PROGRESS ({item.currentEnemy + 1}/{item.enemyCount})
                    </Text>
                </View>
            )}

            <Text style={[styles.dungeonDesc, { color: theme.text }]}>{item.description}</Text>

            <View style={styles.rewardsSection}>
                <Text style={[styles.rewardsTitle, { color: theme.secondary }]}>{t.completionRewards}</Text>
                <View style={styles.rewardsRow}>
                    <Text style={[styles.rewardItem, { color: theme.warning }]}>💰 {item.rewards.gold} Gold</Text>
                    <Text style={[styles.rewardItem, { color: theme.success }]}>⭐ {item.rewards.xp} XP</Text>
                    <Text style={[styles.rewardItem, { color: theme.primary }]}>⚒️ {item.rewards.tetranuta} Tetranuta</Text>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.enterButton, { backgroundColor: theme.danger }]}
                onPress={() => onDungeonSelected(item._id)}
            >
                <Text style={[styles.enterButtonText, { color: theme.textLight }]}>
                    {item.inProgress ? '🔄 CONTINUE' : '🚪 ENTER DUNGEON'}
                </Text>
            </TouchableOpacity>
        </View>
    );

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
                <TouchableOpacity onPress={onBack}>
                    <Text style={[styles.backButton, { color: theme.textLight }]}>{t.backArrow}</Text>
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.textLight }]}>{t.selectDungeon}</Text>
                <View style={{ width: 60 }} />
            </View>

            <FlatList
                data={dungeons}
                keyExtractor={(item) => item._id}
                renderItem={renderDungeon}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#000',
    },
    backButton: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    list: {
        padding: 16,
        gap: 16,
    },
    dungeonCard: {
        padding: 16,
        gap: 12,
    },
    dungeonHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
    },
    dungeonName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    dungeonLevel: {
        fontSize: 14,
        marginTop: 4,
    },
    progressBadge: {
        padding: 8,
        borderRadius: 6,
        alignItems: 'center',
    },
    progressText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
    },
    dungeonDesc: {
        fontSize: 12,
        opacity: 0.8,
    },
    rewardsSection: {
        marginTop: 8,
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
    },
    rewardsTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    rewardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rewardItem: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    enterButton: {
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    enterButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DungeonSelectionScreen;
