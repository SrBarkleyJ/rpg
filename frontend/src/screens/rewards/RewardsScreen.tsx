import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import rewardApi from '../../api/rewardApi';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import PixelCard from '../../components/UI/Card';

const RewardsScreen = () => {
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { theme } = useTheme();
    const { t } = useLanguage();

    useEffect(() => {
        loadRewards();
    }, []);

    const loadRewards = async () => {
        try {
            setLoading(true);
            const data = await rewardApi.getRewards();
            setRewards(data);
        } catch (error) {
            console.error(error);
            Alert.alert(t.error, t.failedToLoadRewards);
        } finally {
            setLoading(false);
        }
    };

    const handleBuyReward = async (rewardId, cost) => {
        try {
            const result = await rewardApi.buyReward(rewardId);
            Alert.alert(t.success, `${t.purchaseSuccess} ${result.remainingGold}`);
        } catch (error) {
            Alert.alert(t.error, error.response?.data?.message || t.purchaseFailed);
        }
    };

    const renderItem = ({ item }) => (
        <PixelCard style={[styles.rewardItem, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.rewardInfo}>
                <Text style={[styles.rewardTitle, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.rewardCost, { color: theme.warning }]}>{item.cost} {t.gold.toUpperCase()}</Text>
            </View>
            <TouchableOpacity
                style={[styles.buyButton, { backgroundColor: theme.secondary, borderColor: theme.border }]}
                onPress={() => handleBuyReward(item._id, item.cost)}
            >
                <Text style={[styles.buyButtonText, { color: theme.textLight }]}>{t.buy}</Text>
            </TouchableOpacity>
        </PixelCard>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.textLight }]}>{t.marketplace}</Text>
            </View>

            <FlatList
                data={rewards}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                refreshing={loading}
                onRefresh={loadRewards}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={[styles.emptyText, { color: theme.text }]}>{t.noItemsInStock}</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: spacing.md },
    header: { alignItems: 'center', marginBottom: spacing.lg, marginTop: spacing.xl },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 2,
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },
    listContent: { paddingBottom: 20 },
    rewardItem: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, borderWidth: 2, padding: spacing.md },
    rewardInfo: { flex: 1 },
    rewardTitle: { fontSize: 18, fontWeight: 'bold' },
    rewardCost: { fontSize: 14, marginTop: 4, fontWeight: 'bold' },
    buyButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 2,
    },
    buyButtonText: { fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16 },
});

export default RewardsScreen;
