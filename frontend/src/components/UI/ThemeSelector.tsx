import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/spacing';

const ThemeSelector = () => {
    const { theme, currentTheme, setTheme, availableThemes } = useTheme();

    const currentThemeData = availableThemes.find(t => t.id === currentTheme) || availableThemes[0];

    const cycleTheme = () => {
        const currentIndex = availableThemes.findIndex(t => t.id === currentTheme);
        const nextIndex = (currentIndex + 1) % availableThemes.length;
        setTheme(availableThemes[nextIndex].id);
    };

    return (
        <TouchableOpacity
            style={[styles.container, { borderColor: theme.border, backgroundColor: theme.surface }]}
            onPress={cycleTheme}
        >
            <Text style={[styles.label, { color: theme.textSecondary }]}>THEME / TEMA</Text>
            <View style={styles.content}>
                <Text style={styles.icon}>{currentThemeData.icon}</Text>
                <Text style={[styles.themeName, { color: theme.text }]}>
                    {currentThemeData.name.toUpperCase()}
                </Text>
                <Text style={[styles.arrow, { color: theme.secondary }]}>→</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderRadius: 8,
        padding: spacing.sm,
        minWidth: 160,
    },
    label: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 4,
        marginLeft: 2,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 2,
    },
    icon: {
        fontSize: 18,
        marginRight: 10,
    },
    themeName: {
        fontSize: 14,
        fontWeight: 'bold',
        flex: 1,
    },
    arrow: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
    }
});

export default ThemeSelector;
