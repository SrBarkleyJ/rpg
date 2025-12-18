import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/hooks/useAuth';
import { InventoryProvider } from './src/hooks/useInventory';
import { ThemeProvider } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { useAuth } from './src/hooks/useAuth';


import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const AppContent = () => {
    const { user } = useAuth();
    const { width: windowWidth } = useWindowDimensions();

    // For Web, we force a mobile-like container
    if (Platform.OS === 'web' && windowWidth > 600) {
        return (
            <View style={styles.webWrapper}>
                <View style={[styles.webContainer, { width: Math.min(windowWidth * 0.9, 450) }]}>
                    <AppNavigator />
                </View>
            </View>
        );
    }

    return <AppNavigator />;
};

export default function App() {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Preload fonts, make any API calls you need to do here
                await Font.loadAsync({
                    // 'Inter-Black': require('./assets/fonts/Inter-Black.otf'),
                });

                // Preload images
                const images = [
                    require('./assets/icon.png'),
                    require('./assets/splash.png'),
                    // Add other heavy assets here
                ];

                const cacheImages = images.map(image => {
                    return Asset.fromModule(image).downloadAsync();
                });

                await Promise.all(cacheImages);

                // Artificially delay for a smooth experience (optional)
                // await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (e) {
                console.warn(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            // This tells the splash screen to hide immediately! If we call this after
            // `setAppIsReady`, then we may see a blank screen while the app is
            // loading its initial state and rendering its first pixels. So instead,
            // we hide the splash screen once we know the root view has already
            // performed layout.
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }

    return (
        <SafeAreaProvider onLayout={onLayoutRootView}>
            <LanguageProvider>
                <ThemeProvider>
                    <AuthProvider>
                        <InventoryProvider>
                            <AppContent />
                        </InventoryProvider>
                    </AuthProvider>
                </ThemeProvider>
            </LanguageProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    webWrapper: {
        flex: 1,
        backgroundColor: '#121212', // Slightly lighter dark for contrast
        alignItems: 'center',
        justifyContent: 'center',
    },
    webContainer: {
        height: '95%',
        maxHeight: 900,
        backgroundColor: '#000',
        borderRadius: 30, // More rounded for modern look
        overflow: 'hidden',
        borderWidth: 8, // Thicker border like a real phone frame
        borderColor: '#222',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.8,
        shadowRadius: 30,
        elevation: 24,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
