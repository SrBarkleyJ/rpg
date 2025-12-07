import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

type Props = {
    navigation: RegisterScreenNavigationProp;
};

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

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
    const { register } = useAuth();
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [step, setStep] = useState(1); // 1: credentials, 2: class/avatar
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const FOCUS_AREAS_OPTIONS = [
        { id: 'Health & Fitness', label: 'Health & Fitness', icon: '💪' },
        { id: 'Mental Wellbeing', label: 'Mental Wellbeing', icon: '🧠' },
        { id: 'Productivity', label: 'Productivity', icon: '🚀' },
        { id: 'Social', label: 'Social & Connections', icon: '🤝' },
        { id: 'Creativity', label: 'Creativity', icon: '🎨' },
    ];

    const AVATARS = [
        { id: 'img1', image: avatar1 },
        { id: 'img2', image: avatar2 },
        { id: 'img3', image: avatar3 },
        { id: 'img4', image: avatar4 },
        { id: 'img5', image: avatar5 },
        { id: 'img6', image: avatar6 },
        { id: 'img7', image: avatar7 },
        { id: 'img8', image: avatar8 },
        { id: 'img9', image: avatar9 },
        { id: 'img10', image: avatar10 },
    ];

    const CLASSES = [
        {
            id: 'warrior',
            name: t.warrior,
            description: t.warriorDesc,
            stats: { STR: 15, INT: 8, VIT: 12, DEX: 10, LUCK: 10 }
        },
        {
            id: 'mage',
            name: t.mage,
            description: t.mageDesc,
            stats: { STR: 8, INT: 15, VIT: 10, DEX: 10, LUCK: 12 }
        },
        {
            id: 'rogue',
            name: t.rogue,
            description: t.rogueDesc,
            stats: { STR: 10, INT: 10, VIT: 10, DEX: 15, LUCK: 12 }
        }
    ];

    const handleNext = () => {
        if (step === 1) {
            if (!username || !email || !password) {
                Alert.alert(t.error, 'Please fill in all fields');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!selectedClass || !selectedAvatar) {
                Alert.alert(t.error, 'Please select a class and avatar');
                return;
            }
            setStep(3);
        }
    };

    const toggleFocusArea = (areaId: string) => {
        if (selectedFocusAreas.includes(areaId)) {
            setSelectedFocusAreas(selectedFocusAreas.filter(id => id !== areaId));
        } else {
            setSelectedFocusAreas([...selectedFocusAreas, areaId]);
        }
    };

    const handleRegister = async () => {
        if (selectedFocusAreas.length === 0) {
            Alert.alert(t.error, 'Please select at least one goal');
            return;
        }

        try {
            setLoading(true);
            const result = await register(username, email, password, selectedClass!, selectedAvatar!, selectedFocusAreas);

            if (!result.success) {
                Alert.alert(t.error, result.error || 'Unknown error occurred');
            }
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert(t.error, 'An unexpected error occurred during registration');
        } finally {
            setLoading(false);
        }
    };



    if (step === 1) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', padding: spacing.lg }]}>
                <Text style={[styles.title, { color: theme.textLight }]}>{t.joinAdventure}</Text>
                <TextInput
                    style={[styles.input, { borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }]}
                    placeholder={t.usernamePlaceholder}
                    placeholderTextColor="#999"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <TextInput
                    style={[styles.input, { borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }]}
                    placeholder={t.emailPlaceholder}
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    style={[styles.input, { borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }]}
                    placeholder={t.passwordPlaceholder}
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary, borderColor: theme.border }]} onPress={handleNext}>
                    <Text style={[styles.buttonText, { color: theme.textLight }]}>{t.next}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: theme.secondary, borderColor: theme.border }]} onPress={() => navigation.navigate('Login')}>
                    <Text style={[styles.buttonText, { color: theme.textLight }]}>{t.loginLink}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // STEP 2: Class & Avatar
    if (step === 2) {
        return (
            <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.title, { color: theme.textLight }]}>{t.selectChar}</Text>

                <Text style={[styles.sectionTitle, { color: theme.textLight }]}>{t.class.toUpperCase()}</Text>
                {CLASSES.map(cls => (
                    <TouchableOpacity
                        key={cls.id}
                        style={[
                            styles.classCard,
                            { backgroundColor: theme.surface, borderColor: theme.border },
                            selectedClass === cls.id && { borderColor: theme.warning, borderWidth: 3 }
                        ]}
                        onPress={() => setSelectedClass(cls.id)}
                    >
                        <Text style={[styles.className, { color: theme.text }]}>{cls.name}</Text>
                        <Text style={[styles.classDesc, { color: theme.text }]}>{cls.description}</Text>
                        <View style={styles.statsRow}>
                            {Object.entries(cls.stats).map(([stat, value]) => (
                                <Text key={stat} style={[styles.statText, { backgroundColor: theme.background, color: theme.text }]}>{stat}: {value}</Text>
                            ))}
                        </View>
                    </TouchableOpacity>
                ))}

                {selectedClass && (
                    <>
                        <Text style={[styles.sectionTitle, { color: theme.textLight }]}>{t.selectAvatar}</Text>
                        <View style={styles.avatarGrid}>
                            {AVATARS.map(avatar => (
                                <TouchableOpacity
                                    key={avatar.id}
                                    style={[
                                        styles.avatarCard,
                                        { backgroundColor: theme.surface, borderColor: theme.border },
                                        selectedAvatar === avatar.id && { borderColor: theme.warning, borderWidth: 3 }
                                    ]}
                                    onPress={() => setSelectedAvatar(avatar.id)}
                                >
                                    <Image
                                        source={avatar.image}
                                        style={styles.avatarImage}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}

                <TouchableOpacity
                    style={[
                        styles.button,
                        { backgroundColor: theme.primary, borderColor: theme.border },
                        (!selectedClass || !selectedAvatar) && styles.buttonDisabled
                    ]}
                    onPress={handleNext}
                    disabled={!selectedClass || !selectedAvatar}
                >
                    <Text style={[styles.buttonText, { color: theme.textLight }]}>{t.next}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: theme.secondary, borderColor: theme.border }]} onPress={() => setStep(1)}>
                    <Text style={[styles.buttonText, { color: theme.textLight }]}>{t.back}</Text>
                </TouchableOpacity>
            </ScrollView >
        );
    }

    // STEP 3: Focus Areas
    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.scrollContent}>
            <Text style={[styles.title, { color: theme.textLight }]}>Choose Your Path</Text>
            <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 20 }]}>
                What are your main goals? We will tailor your missions to help you achieve them.
            </Text>

            <View style={{ gap: 10 }}>
                {FOCUS_AREAS_OPTIONS.map((area) => (
                    <TouchableOpacity
                        key={area.id}
                        style={[
                            styles.classCard,
                            {
                                backgroundColor: theme.surface,
                                borderColor: selectedFocusAreas.includes(area.id) ? theme.success : theme.border,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 20
                            },
                        ]}
                        onPress={() => toggleFocusArea(area.id)}
                    >
                        <Text style={{ fontSize: 30, marginRight: 15 }}>{area.icon}</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.className, { color: theme.text, marginBottom: 0 }]}>{area.label}</Text>
                        </View>
                        {selectedFocusAreas.includes(area.id) && (
                            <Text style={{ fontSize: 24, color: theme.success }}>✅</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
                style={[
                    styles.button,
                    { backgroundColor: theme.primary, borderColor: theme.border },
                    (selectedFocusAreas.length === 0 || loading) && styles.buttonDisabled
                ]}
                onPress={handleRegister}
                disabled={selectedFocusAreas.length === 0 || loading}
            >
                {loading ? (
                    <ActivityIndicator color={theme.textLight} />
                ) : (
                    <Text style={[styles.buttonText, { color: theme.textLight }]}>{t.createChar}</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.secondary, borderColor: theme.border }]} onPress={() => setStep(2)}>
                <Text style={[styles.buttonText, { color: theme.textLight }]}>{t.back}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: spacing.md },
    scrollContent: { paddingTop: spacing.xl * 2, paddingBottom: spacing.xl },
    title: {
        fontSize: 28,
        marginBottom: spacing.lg,
        textAlign: 'center',
        fontWeight: 'bold',
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
        textAlign: 'center'
    },
    input: {
        borderWidth: 2,
        padding: 12,
        marginBottom: spacing.md,
        borderRadius: 0,
        fontSize: 16
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderWidth: 2,
        marginTop: spacing.md,
        alignItems: 'center'
    },
    buttonDisabled: {
        backgroundColor: '#888',
        opacity: 0.5
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    classCard: {
        borderWidth: 2,
        padding: spacing.md,
        marginBottom: spacing.sm
    },
    className: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4
    },
    classDesc: {
        fontSize: 14,
        marginBottom: spacing.sm
    },
    statsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8
    },
    statText: {
        fontSize: 12,
        fontWeight: 'bold',
        paddingHorizontal: 6,
        paddingVertical: 2
    },
    avatarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: spacing.md
    },
    avatarCard: {
        borderWidth: 2,
        padding: spacing.sm,
        alignItems: 'center',
        width: '18%',
        marginBottom: spacing.sm,
        aspectRatio: 1
    },
    avatarImage: {
        width: '100%',
        height: '100%'
    }
});

export default RegisterScreen;
