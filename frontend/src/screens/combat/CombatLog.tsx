import React, { RefObject } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/spacing';

interface CombatLogProps {
    logs: any[];
    theme: any;
    scrollViewRef: RefObject<ScrollView>;
    t: any;
}

const CombatLog: React.FC<CombatLogProps> = ({ logs, theme, scrollViewRef, t }) => {
    const renderLogItem = (log: any, index: number) => (
        <Text key={index} style={[styles.logText, { color: theme.text }]}>
            <Text style={{ 
                fontWeight: 'bold', 
                color: log.actor === 'Player' ? theme.success : 
                       log.actor === 'System' ? theme.warning : theme.danger 
            }}>
                {log.actor}:
            </Text>
            {' '}{log.message || `${log.action} ${log.damage ? `(${log.damage} dmg)` : ''}`}
        </Text>
    );

    return (
        <View style={[styles.logContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.logContent}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
                {logs.length === 0 ? (
                    <Text style={[styles.placeholderText, { color: theme.text }]}>
                        {t.pressToStart || 'Press START COMBAT to begin'}
                    </Text>
                ) : (
                    logs.map((log, index) => renderLogItem(log, index))
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    logContainer: {
        flex: 1,
        borderWidth: 2,
        marginBottom: spacing.md,
        padding: spacing.sm,
        minHeight: 150,
    },
    logContent: {
        paddingBottom: spacing.md,
    },
    logText: {
        fontSize: 13,
        marginBottom: 4,
        fontFamily: 'monospace',
    },
    placeholderText: {
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
    },
});

export default CombatLog;