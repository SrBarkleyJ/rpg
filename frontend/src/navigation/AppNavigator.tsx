import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import MainTabs from './TabNavigator';
import { useAuth } from '../hooks/useAuth';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { user, isLoading } = useAuth();
    // console.log('[AppNavigator] isLoading:', isLoading, 'User:', user ? 'Logged In' : 'No Session');

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#8b4513" />
                <Text>Loading RPG...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    // Use lazy loading for the entire TabNavigator to be safe
                    <Stack.Screen
                        name="Main"
                        component={MainTabs}
                    />
                ) : (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
