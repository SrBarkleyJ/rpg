import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import skillApi from '../../api/skillApi';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import PixelCard from '../../components/UI/Card';

const SkillsScreen = () => {
    const [skills, setSkills] = useState<any[]>([]);
    const [availableSP, setAvailableSP] = useState(0);
    const [loading, setLoading] = useState(true);
    const { updateUser } = useAuth();
    const { theme } = useTheme();
    const { t } = useLanguage();

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            setLoading(true);
            const response = await skillApi.getSkills();
            setSkills(response.data.skills);
            setAvailableSP(response.data.availableSP);
        } catch (error) {
            console.error(error);
            Alert.alert(t.error, 'Failed to load skills');
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = async (skillId: string) => {
        try {
            const result = await skillApi.upgradeSkill(skillId);
            if (result.data.user) {
                await updateUser(result.data.user);
                Alert.alert(t.success, result.data.message);
                loadSkills();
            }
        } catch (error) {
            console.error(error);
            Alert.alert(t.error, error.response?.data?.message || 'Failed to upgrade skill');
        }
    };

    const getSkillIcon = (type: string) => {
        switch (type) {
            case 'damage': return '⚔️';
            case 'defensive': return '🛡️';
            case 'buff': return '💪';
            case 'control': return '❄️';
            case 'dot': return '☠️';
            case 'finisher': return '⚡';
            case 'chain': return '🔗';
            case 'utility': return '✨';
            default: return '🎯';
        }
    };

    const renderSkill = (skill: any) => {
        const isMaxed = skill.currentLevel >= 5;
        const canUpgrade = !isMaxed && availableSP >= (skill.nextCost || 0);

        return (
            <PixelCard
                key={skill.id}
                style={[styles.skillCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
                <View style={styles.skillHeader}>
                    <Text style={styles.skillIcon}>{getSkillIcon(skill.type)}</Text>
                    <View style={styles.skillInfo}>
                        <Text style={[styles.skillName, { color: theme.text }]}>
                            {t[skill.name] || skill.name}
                        </Text>
                        <Text style={[styles.skillDesc, { color: theme.text }]}>
                            {t[`${skill.name}_desc`] || skill.description}
                        </Text>
                    </View>
                </View>

                <View style={styles.levelContainer}>
                    <Text style={[styles.levelText, { color: theme.text }]}>
                        {t.level}: {skill.currentLevel} / {skill.maxLevel}
                    </Text>
                    <View style={[styles.levelBar, { backgroundColor: theme.background }]}>
                        <View
                            style={[
                                styles.levelFill,
                                {
                                    backgroundColor: theme.primary,
                                    width: `${(skill.currentLevel / skill.maxLevel) * 100}%`
                                }
                            ]}
                        />
                    </View>
                </View>

                {skill.cooldown > 0 && (
                    <Text style={[styles.cooldownText, { color: theme.warning }]}>
                        🕐 Cooldown: {skill.cooldown}/{skill.maxCooldown}
                    </Text>
                )}

                {!isMaxed && (
                    <TouchableOpacity
                        style={[
                            styles.upgradeButton,
                            {
                                backgroundColor: canUpgrade ? theme.primary : theme.surface,
                                borderColor: theme.border,
                                opacity: canUpgrade ? 1 : 0.5
                            }
                        ]}
                        onPress={() => handleUpgrade(skill.id)}
                        disabled={!canUpgrade}
                    >
                        <Text style={[styles.upgradeText, { color: canUpgrade ? theme.textLight : theme.text }]}>
                            {t.upgrade} ({skill.nextCost} SP)
                        </Text>
                    </TouchableOpacity>
                )}

                {isMaxed && (
                    <View style={[styles.maxedBadge, { backgroundColor: theme.success }]}>
                        <Text style={[styles.maxedText, { color: theme.textLight }]}>✓ MAX</Text>
                    </View>
                )}
            </PixelCard>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.textLight }]}>{t.skillsTitle}</Text>
                <View style={[styles.spContainer, { backgroundColor: theme.primary, borderColor: theme.border }]}>
                    <Text style={[styles.spText, { color: theme.textLight }]}>
                        🎯 {availableSP} SP
                    </Text>
                </View>
            </View>

            {loading ? (
                <Text style={{ color: theme.text, textAlign: 'center', marginTop: 20 }}>{t.loading}</Text>
            ) : (
                <ScrollView contentContainerStyle={styles.skillsContainer}>
                    {skills.map(skill => renderSkill(skill))}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.md,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.md,
        marginTop: spacing.md,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 2,
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
        marginBottom: spacing.sm,
    },
    spContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 2,
    },
    spText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    skillsContainer: {
        paddingBottom: spacing.xl,
    },
    skillCard: {
        marginBottom: spacing.md,
        padding: spacing.md,
        borderWidth: 2,
    },
    skillHeader: {
        flexDirection: 'row',
        marginBottom: spacing.sm,
    },
    skillIcon: {
        fontSize: 48,
        marginRight: spacing.sm,
    },
    skillInfo: {
        flex: 1,
    },
    skillName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    skillDesc: {
        fontSize: 12,
        opacity: 0.8,
    },
    levelContainer: {
        marginBottom: spacing.sm,
    },
    levelText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    levelBar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    levelFill: {
        height: '100%',
    },
    cooldownText: {
        fontSize: 12,
        marginBottom: spacing.sm,
    },
    upgradeButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 4,
        borderWidth: 2,
        alignItems: 'center',
    },
    upgradeText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    maxedBadge: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        alignItems: 'center',
    },
    maxedText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default SkillsScreen;
