import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import combatApi from '../../api/combatApi';

import DifficultyIndicator from '../../components/combat/DifficultyIndicator';

interface Enemy {
    _id: string;
    name: string;
    image: string;
    tier: number;
    level: number;
    stats: {
        hp: number;
        strength: number;
        defense: number;
        mana: number;
    };
    rewards: {
        gold: number;
        xp: number;
        tetranutaChance: number;
    };
    difficulty: 'easy' | 'medium' | 'hard' | 'very-hard' | 'extreme';
    description: string;
}

interface EnemySelectionScreenProps {
    onEnemySelected: (enemy: Enemy) => void;
    onBack: () => void;
}

const EnemySelectionScreen: React.FC<EnemySelectionScreenProps> = ({ onEnemySelected, onBack }) => {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [enemies, setEnemies] = useState<Enemy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEnemies();
    }, []);

    const loadEnemies = async () => {
        try {
            setLoading(true);
            const data = await combatApi.getEnemies();
            setEnemies(data.enemies);
        } catch (error: any) {
            console.error('Error loading enemies:', error);
            Alert.alert('Error', 'Failed to load enemies');
        } finally {
            setLoading(false);
        }
    };

    const renderEnemy = ({ item }: { item: Enemy }) => (
        <View style={[styles.enemyCard, { backgroundColor: theme.surface, borderColor: theme.border, borderWidth: 2, borderRadius: 8, padding: 16 }]}>
            <View style={styles.enemyHeader}>
                <View>
                    <Text style={[styles.enemyName, { color: theme.text }]}>{item.name}</Text>
                    <Text style={[styles.enemyLevel, { color: theme.secondary }]}>Level {item.level} • Tier {item.tier}</Text>
                </View>
                <DifficultyIndicator difficulty={item.difficulty} showIcon />
            </View>

            <Text style={[styles.enemyDesc, { color: theme.text }]}>{item.description}</Text>

            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <Text style={[styles.statLabel, { color: theme.secondary }]}>{t.hp}</Text>
                    <Text style={[styles.statValue, { color: theme.danger }]}>{item.stats.hp}</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={[styles.statLabel, { color: theme.secondary }]}>{t.strength}</Text>
                    <Text style={[styles.statValue, { color: theme.warning }]}>{item.stats.strength}</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={[styles.statLabel, { color: theme.secondary }]}>{t.def}</Text>
                    <Text style={[styles.statValue, { color: theme.primary }]}>{item.stats.defense}</Text>
                </View>
            </View>

            <View style={styles.rewardsRow}>
                <Text style={[styles.rewardText, { color: theme.warning }]}>
                    💰 {item.rewards.gold} Gold
                </Text>
                <Text style={[styles.rewardText, { color: theme.success }]}>
                    ⭐ {item.rewards.xp} XP
                </Text>
                <Text style={[styles.rewardText, { color: theme.secondary }]}>
                    ⚒️ {Math.floor(item.rewards.tetranutaChance * 100)}%
                </Text>
            </View>

            <TouchableOpacity
                style={[styles.fightButton, { backgroundColor: theme.danger }]}
                onPress={() => onEnemySelected(item)}
            >
                <Text style={[styles.fightButtonText, { color: theme.textLight }]}>{t.fightIcon}</Text>
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
                <Text style={[styles.title, { color: theme.textLight }]}>{t.selectEnemy}</Text>
                <View style={{ width: 60 }} />
            </View>

            <FlatList
                data={enemies}
                keyExtractor={(item) => item._id}
                renderItem={renderEnemy}
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
    enemyCard: {
        padding: 16,
        gap: 12,
    },
    enemyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    enemyName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    enemyLevel: {
        fontSize: 14,
        marginTop: 4,
    },
    enemyDesc: {
        fontSize: 12,
        opacity: 0.8,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 24,
        marginTop: 8,
    },
    stat: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 4,
    },
    rewardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    rewardText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    fightButton: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    fightButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EnemySelectionScreen;
