import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const ProgressBar = ({ current, max, label, color }) => {
    const { theme } = useTheme();
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));
    const barColor = color || theme.xpBar;

    return (
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
                <Text style={[styles.value, { color: theme.text }]}>{current} / {max}</Text>
            </View>
            <View style={[styles.barBackground, { borderColor: theme.border }]}>
                <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: barColor }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    value: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    barBackground: {
        height: 20,
        backgroundColor: '#555',
        borderWidth: 4, // Hardcoded pixel border width since borders object is gone
    },
    barFill: {
        height: '100%',
    },
});

export default ProgressBar;
