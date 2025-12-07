import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/spacing';

const PixelButton = ({ title, onPress, color, textColor, style }) => {
    const { theme } = useTheme();
    const buttonColor = color || theme.primary;
    const buttonTextColor = textColor || theme.textLight;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: buttonColor, borderColor: theme.border },
                style
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text style={[styles.text, { color: buttonTextColor }]}>{title.toUpperCase()}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderWidth: 4,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        // Retro clicky feel
        borderBottomWidth: 6,
        borderRightWidth: 6,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
});

export default PixelButton;
