import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { spacing } from '../../theme/spacing';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

type Props = {
    navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const { login } = useAuth();
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!emailOrUsername || !password) {
            Alert.alert(t.error, 'Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            console.log('Logging in user:', emailOrUsername);

            const result = await login(emailOrUsername, password);

            if (!result.success) {
                Alert.alert(t.error, result.error || 'Invalid credentials');
            } else {
                console.log('Login successful!');
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert(t.error, 'An unexpected error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.textLight }]}>⚔️ {t.welcome} ⚔️</Text>
            <Text style={styles.subtitle}>{t.loginSubtitle}</Text>

            <TextInput
                style={[styles.input, { borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }]}
                placeholder={t.emailPlaceholder}
                placeholderTextColor="#999"
                value={emailOrUsername}
                onChangeText={setEmailOrUsername}
                autoCapitalize="none"
            />
            <TextInput
                style={[styles.input, { borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }]}
                placeholder={t.passwordPlaceholder}
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary, borderColor: theme.border }, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={theme.textLight} />
                ) : (
                    <Text style={[styles.buttonText, { color: theme.textLight }]}>{t.loginButton}</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.secondary, borderColor: theme.border }]}
                onPress={() => navigation.navigate('Register')}
                disabled={loading}
            >
                <Text style={[styles.buttonText, { color: theme.textLight }]}>{t.createAccount}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: spacing.lg,
    },
    title: {
        fontSize: 28,
        marginBottom: spacing.sm,
        textAlign: 'center',
        fontWeight: 'bold',
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: spacing.xl,
        textAlign: 'center',
        color: '#999',
    },
    input: {
        borderWidth: 2,
        padding: 12,
        marginBottom: spacing.md,
        borderRadius: 0,
        fontSize: 16,
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderWidth: 2,
        marginTop: spacing.sm,
        alignItems: 'center'
    },
    buttonDisabled: {
        opacity: 0.5
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
});

export default LoginScreen;
