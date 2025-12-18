import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DungeonInfoDisplayProps {
    dungeonInfo: {
        name: string;
        currentEnemy: number;
        totalEnemies: number;
    };
    theme: any;
}

const DungeonInfoDisplay: React.FC<DungeonInfoDisplayProps> = ({ dungeonInfo, theme }) => {
    return (
        <View style={{ flex: 1, maxHeight: 20 }}>
            <View
                style={[styles.dungeonInfo, { backgroundColor: theme.surface, borderColor: theme.border, flex: 1, paddingVertical: 4 }]}
                accessibilityLabel={`Dungeon: ${dungeonInfo.name}. Progress: ${dungeonInfo.currentEnemy + 1} of ${dungeonInfo.totalEnemies} enemies.`}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flex: 1 }}>
                    <Text style={[styles.dungeonName, { color: theme.text, fontSize: 12, marginBottom: 0, flex: 1 }]}>
                        🏰 {dungeonInfo.name}
                    </Text>
                    <View style={{ width: '40%', marginRight: 8 }}>
                        <View
                            style={[styles.progressBarBg, { height: 6, marginBottom: 2 }]}
                            accessibilityRole="progressbar"
                            accessibilityValue={{
                                min: 0,
                                max: dungeonInfo.totalEnemies,
                                now: dungeonInfo.currentEnemy + 1
                            }}
                        >
                            <View
                                style={[
                                    styles.progressBarFill,
                                    {
                                        backgroundColor: theme.primary,
                                        width: `${(dungeonInfo.currentEnemy / dungeonInfo.totalEnemies) * 100}%`
                                    }
                                ]}
                            />
                        </View>
                        <Text style={[styles.progressText, { color: theme.secondary, fontSize: 10 }]}>
                            {dungeonInfo.currentEnemy + 1}/{dungeonInfo.totalEnemies}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    dungeonInfo: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 2,
    },
    dungeonName: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    progressBarBg: {
        width: '100%',
        backgroundColor: '#333',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    progressText: {
        fontWeight: 'bold',
    },
});

export default DungeonInfoDisplay;
