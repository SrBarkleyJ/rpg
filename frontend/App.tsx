import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/hooks/useAuth';
import { ThemeProvider } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';

import { useAuth } from './src/hooks/useAuth';
import { usePushNotifications } from './src/hooks/usePushNotifications';

const AppContent = () => {
    const { token } = useAuth();
    usePushNotifications(token);
    return <AppNavigator />;
};

export default function App() {
    return (
        <SafeAreaProvider>
            <LanguageProvider>
                <ThemeProvider>
                    <AuthProvider>
                        <AppContent />
                    </AuthProvider>
                </ThemeProvider>
            </LanguageProvider>
        </SafeAreaProvider>
    );
}
