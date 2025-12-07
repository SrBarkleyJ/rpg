import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/spacing';

interface PixelCardProps {
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
}

const PixelCard = ({ children, style = {} }: PixelCardProps) => {
    const { theme } = useTheme();
    return (
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderWidth: 4,
        padding: spacing.md,
        marginBottom: spacing.md,
        // Shadow for depth (retro style)
        borderBottomWidth: 8,
        borderRightWidth: 8,
    },
});

export default PixelCard;
