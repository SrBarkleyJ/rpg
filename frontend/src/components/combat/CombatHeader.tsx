import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CombatHeaderProps {
    title: string;
    backText: string;
    onBack: () => void;
    theme: any;
}

const CombatHeader: React.FC<CombatHeaderProps> = ({ title, backText, onBack, theme }) => {
    return (
        <View style={styles.header}>
            <Text
                style={[styles.headerTitle, { color: theme.textLight }]}
                accessibilityRole="header"
            >
                {title}
            </Text>
            <TouchableOpacity
                style={[styles.backButton, { backgroundColor: theme.secondary }]}
                onPress={onBack}
                accessibilityRole="button"
                accessibilityLabel={backText}
            >
                <Text style={[styles.backButtonText, { color: theme.textLight }]}>{backText}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        marginTop: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 2,
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        flex: 1,
        textAlign: 'center',
    },
    backButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    backButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default CombatHeader;
