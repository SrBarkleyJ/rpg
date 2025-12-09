import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Switch, Alert } from 'react-native';
import profileApi from '../../api/profileApi';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import PixelCard from '../../components/UI/Card';
import ThemeSelector from '../../components/UI/ThemeSelector';

// Avatar imports
import avatar1 from '../../../assets/images/classes/img1.png';
import avatar2 from '../../../assets/images/classes/img2.png';
import avatar3 from '../../../assets/images/classes/img3.png';
import avatar4 from '../../../assets/images/classes/img4.png';
import avatar5 from '../../../assets/images/classes/img5.png';
import avatar6 from '../../../assets/images/classes/img6.png';
import avatar7 from '../../../assets/images/classes/img7.png';
import avatar8 from '../../../assets/images/classes/img8.png';
import avatar9 from '../../../assets/images/classes/img9.png';
import avatar10 from '../../../assets/images/classes/img10.png';

const AVATAR_MAP = {
    img1: avatar1,
    img2: avatar2,
    img3: avatar3,
    img4: avatar4,
    img5: avatar5,
    img6: avatar6,
    img7: avatar7,
    img8: avatar8,
    img9: avatar9,
    img10: avatar10,
};

const ProfileScreen = () => {
    const { user, logout, updateUser } = useAuth();
    const { theme } = useTheme();
    const { language, toggleLanguage, t } = useLanguage();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    useEffect(() => {
        if (user) {
            setProfile(user);
        }
    }, [user]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await profileApi.getProfile();
            setProfile(data);
            await updateUser(data);
        } catch (error) {
            console.error(error);
            Alert.alert(t.error, t.failedToLoadProfile);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <View style={[styles.container, { backgroundColor: theme.background }]}><Text style={{ color: theme.text }}>{t.loading}</Text></View>;

    const avatarSource = AVATAR_MAP[profile?.avatar] || avatar1;

    const classNames = {
        warrior: t.warrior,
        mage: t.mage,
        rogue: t.rogue
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.textLight }]}>{t.profileTitle}</Text>
            </View>

            <PixelCard style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={[styles.avatarContainer, { borderColor: theme.border }]}>
                    <Image source={avatarSource} style={[styles.avatar, { borderColor: theme.border }]} />
                </View>

                <Text style={[styles.username, { color: theme.text }]}>{profile?.username}</Text>
                <Text style={[styles.classText, { color: theme.secondary }]}>{classNames[profile?.class] || profile?.class}</Text>
                <Text style={[styles.email, { color: theme.text }]}>{profile?.email}</Text>

                <View style={[styles.divider, { backgroundColor: theme.border }]} />

                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Text style={[styles.statValue, { color: theme.text }]}>{profile?.level}</Text>
                        <Text style={[styles.statLabel, { color: theme.text }]}>{t.level}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={[styles.statValue, { color: theme.text }]}>{profile?.xp}</Text>
                        <Text style={[styles.statLabel, { color: theme.text }]}>{t.xp}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={[styles.statValue, { color: theme.warning }]}>{profile?.gold}</Text>
                        <Text style={[styles.statLabel, { color: theme.text }]}>{t.gold}</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={[styles.statValue, { color: theme.warning }]}>{profile?.tetranuta || 0}</Text>
                        <Text style={[styles.statLabel, { color: theme.text }]}>Tetranuta</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={[styles.statValue, { color: theme.secondary }]}>{profile?.skillPoints || 0}</Text>
                        <Text style={[styles.statLabel, { color: theme.text }]}>{t.skillPoints}</Text>
                    </View>
                </View>
            </PixelCard>

            <PixelCard style={[styles.settingsCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={[styles.settingRow, { borderBottomColor: theme.border }]}>
                    <Text style={[styles.settingLabel, { color: theme.text }]}>{t.language}</Text>
                    <TouchableOpacity style={[styles.languageButton, { backgroundColor: theme.primary, borderColor: theme.border }]} onPress={toggleLanguage}>
                        <Text style={[styles.languageButtonText, { color: theme.textLight }]}>{language.toUpperCase()}</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.settingRow, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                    <ThemeSelector />
                </View>
            </PixelCard>

            <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.danger, borderColor: theme.border }]} onPress={logout}>
                <Text style={[styles.logoutButtonText, { color: theme.textLight }]}>{t.logout}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', padding: spacing.md },
    header: { alignItems: 'center', marginBottom: spacing.lg, marginTop: spacing.md },
    headerTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        letterSpacing: 2,
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },
    profileCard: { width: '100%', alignItems: 'center', paddingVertical: spacing.xl, marginBottom: spacing.md, borderWidth: 2 },
    avatarContainer: {
        width: '50%',              // tamaño visible del avatar
        height: '50%',
        borderRadius: 30,
        borderWidth: 1,
        overflow: 'hidden',      // <- recorta lo que sobresale
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },

    avatar: {
        width: '100%',              // más grande que el contenedor
        height: '100%',
        resizeMode: 'cover',
        transform: [
            { scale: 1.2 },      // zoom para que nunca queden huecos
            { translateY: 14 },  // offset vertical
            // { translateX: ? } si deseas
        ],
    },
    username: { fontSize: 26, fontWeight: 'bold', marginBottom: 4 },
    classText: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    email: { fontSize: 15, marginBottom: spacing.md },
    divider: { width: '80%', height: 2, marginVertical: spacing.md },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        width: '100%'
    },
    statBox: { alignItems: 'center', width: '45%', marginBottom: spacing.sm },
    statValue: { fontSize: 28, fontWeight: 'bold' },
    statLabel: { fontSize: 14, fontWeight: 'bold', marginTop: 4 },
    settingsCard: { width: '100%', padding: spacing.md, marginBottom: spacing.md, borderWidth: 2 },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        marginBottom: spacing.sm
    },
    settingLabel: { fontSize: 16, fontWeight: 'bold' },
    languageButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 2,
    },
    languageButtonText: { fontWeight: 'bold', fontSize: 14 },
    logoutButton: {
        paddingVertical: 14,
        paddingHorizontal: 50,
        marginTop: spacing.md,
        borderWidth: 2,
    },
    logoutButtonText: { fontSize: 18, fontWeight: 'bold' },
});

export default ProfileScreen;
