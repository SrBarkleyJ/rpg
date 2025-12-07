import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface DifficultyIndicatorProps {
    difficulty: 'easy' | 'medium' | 'hard' | 'very-hard' | 'extreme';
    showIcon?: boolean;
}

const DifficultyIndicator: React.FC<DifficultyIndicatorProps> = ({ difficulty, showIcon = false }) => {
    const { theme } = useTheme();

    const getDifficultyConfig = () => {
        switch (difficulty) {
            case 'easy':
                return { color: '#4ade80', label: 'Easy', icon: '✓' };
            case 'medium':
                return { color: '#facc15', label: 'Medium', icon: '!' };
            case 'hard':
                return { color: '#fb923c', label: 'Hard', icon: '!!' };
            case 'very-hard':
                return { color: '#f87171', label: 'Very Hard', icon: '⚠️' };
            case 'extreme':
                return { color: '#a855f7', label: 'Extreme', icon: '💀' };
            default:
                return { color: theme.text, label: difficulty, icon: '?' };
        }
    };

    const config = getDifficultyConfig();

    return (
        <View style={[styles.badge, { backgroundColor: config.color }]}>
            {showIcon && <Text style={styles.icon}>{config.icon}</Text>}
            <Text style={styles.label}>{config.label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    icon: {
        fontSize: 12,
        color: '#000',
        fontWeight: 'bold',
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
        textTransform: 'uppercase',
    },
});

export default DifficultyIndicator;
