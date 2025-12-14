import React, { useState, useEffect, memo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, ImageSourcePropType } from 'react-native';
import skillApi from '../../api/skillApi';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import PixelCard from '../../components/UI/Card';

// Skill Icons Mapping - synced with skillDefinitions.js
const SKILL_ICONS: Record<string, ImageSourcePropType> = {
    // Warrior Skills
    'Bash': require('../../../assets/icons/bash.jpg'),
    'Berserk': require('../../../assets/icons/berserk.jpg'),
    'Execute': require('../../../assets/icons/execute.jpg'),
    'Ground Slam': require('../../../assets/icons/ground_slam.jpg'),
    'War Cry': require('../../../assets/icons/war_cry.jpg'),
    'Charge': require('../../../assets/icons/charge.jpg'),

    // Mage Skills
    'Fireball': require('../../../assets/icons/fireball.jpg'),
    'Ice Shard': require('../../../assets/icons/ice_shard.jpg'),
    'Arcane Bolt': require('../../../assets/icons/arcane_bolt.jpg'),
    'Meteor': require('../../../assets/icons/Icon_meteor.png'),
    'Chain Lightning': require('../../../assets/icons/chain_lightning.jpg'),
    'Thunder Strike': require('../../../assets/icons/lightning_strike.jpg'),

    // Rogue Skills
    'Double Stab': require('../../../assets/icons/double_stab.jpg'),
    'Poison Tip': require('../../../assets/icons/poison_tip.jpg'),
    'Backstab': require('../../../assets/icons/backstab.jpg'),
    'Assassinate': require('../../../assets/icons/assassinate.jpg'),
    'Shadow Strike': require('../../../assets/icons/Icon_shadow_strike.png'),
    'Blade Dance': require('../../../assets/icons/blade_dance.jpg'),
};

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
            Alert.alert(t.error, t.failedToLoadSkills);
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = async (skillId: string) => {
        try {
            const result = await skillApi.upgradeSkill(skillId);
            if (result.data.user) {
                await updateUser(result.data.user);

                loadSkills();
            }
        } catch (error: any) {
            console.error(error);
            Alert.alert(t.error, error.response?.data?.message || t.failedToUpgradeSkill);
        }
    };

    const renderSkill = (skill: any) => {
        const isMaxed = skill.currentLevel >= 5;
        const canUpgrade = !isMaxed && availableSP >= (skill.nextCost || 0);
        const skillIcon = SKILL_ICONS[skill.name];

        return (
            <PixelCard
                key={skill.id}
                style={[styles.skillCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
                <View style={styles.skillHeader}>
                    {skillIcon ? (
                        <Image source={skillIcon} style={styles.skillIcon} resizeMode="contain" />
                    ) : (
                        <View style={[styles.skillIconPlaceholder, { backgroundColor: theme.primary }]}>
                            <Text style={[styles.skillIconText, theme.typography.h1]}>?</Text>
                        </View>
                    )}
                    <View style={styles.skillInfo}>
                        <Text style={[styles.skillName, theme.typography.h2, { color: theme.text }]}>
                            {t[skill.name] || skill.name}
                        </Text>
                        <Text style={[styles.skillDesc, theme.typography.body, { color: theme.text }]} numberOfLines={2}>
                            {t[`${skill.name}_desc`] || skill.description}
                        </Text>
                    </View>
                </View>

                <View style={styles.levelContainer}>
                    <Text style={[styles.levelText, theme.typography.h3, { color: theme.text }]}>
                        Lv. {skill.currentLevel} / {skill.maxLevel}
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

                {!isMaxed ? (
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
                        <Text style={[styles.upgradeText, theme.typography.h3, { color: canUpgrade ? theme.textLight : theme.text }]}>
                            ⬆ {skill.nextCost} SP
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <View style={[styles.maxedBadge, { backgroundColor: theme.success }]}>
                        <Text style={[styles.maxedText, theme.typography.h3, { color: theme.textLight }]}>✓ {t.max}</Text>
                    </View>
                )}
            </PixelCard>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, theme.typography.h1, { color: theme.text }]}>{t.skillsTitleIcon}</Text>
                <View style={[styles.spContainer, { backgroundColor: theme.primary, borderColor: theme.border }]}>
                    <Text style={[styles.spText, theme.typography.h2, { color: theme.textLight }]}>
                        🎯 {availableSP} SP
                    </Text>
                </View>
            </View>

            {loading ? (
                <Text style={[theme.typography.body, { color: theme.text, textAlign: 'center', marginTop: 20 }]}>{t.loading}</Text>
            ) : (
                <ScrollView contentContainerStyle={styles.skillsContainer} showsVerticalScrollIndicator={false}>
                    {skills.map(skill => renderSkill(skill))}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
        marginTop: spacing.md,
    },
    headerTitle: {


        letterSpacing: 2,
    },
    spContainer: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 23,
        borderWidth: 2,
    },
    spText: {
        fontWeight: 'bold',

    },
    skillsContainer: {
        paddingBottom: 90,
    },
    skillCard: {
        marginBottom: spacing.lg,
        padding: spacing.lg,
        borderWidth: 2,
    },
    skillHeader: {
        flexDirection: 'row',
        marginBottom: spacing.lg,
    },
    skillIcon: {
        width: 70,
        height: 70,
        marginRight: spacing.lg,
        borderRadius: 6,
    },
    skillIconPlaceholder: {
        width: 70,
        height: 70,
        marginRight: spacing.lg,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    skillIconText: {

        color: 'white',
    },
    skillInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    skillName: {


        marginBottom: 4,
    },
    skillDesc: {

        opacity: 0.7,
    },
    levelContainer: {
        marginBottom: spacing.lg,
    },
    levelText: {


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
    upgradeButton: {
        paddingVertical: 12,
        paddingHorizontal: 17,
        borderRadius: 6,
        borderWidth: 2,
        alignItems: 'center',
    },
    upgradeText: {

        fontWeight: 'bold',
    },
    maxedBadge: {
        paddingVertical: 12,
        paddingHorizontal: 17,
        borderRadius: 6,
        alignItems: 'center',
    },
    maxedText: {

        fontWeight: 'bold',
    },
});

export default memo(SkillsScreen);
