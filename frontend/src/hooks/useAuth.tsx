import React, { useState, useEffect, createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authApi from '../api/authApi';

// Type definitions
interface User {
    id: string;
    username: string;
    email?: string;
    class: string;
    avatar: string;
    focusAreas?: string[];
    xp: number;
    level: number;
    gold: number;
    tetranuta?: number;
    stamina: number;
    stats: {
        strength: number;
        intelligence: number;
        vitality: number;
        dexterity: number;
        luck: number;
    };
    combat: {
        currentHP: number;
        maxHP: number;
        currentMana?: number;
        maxMana?: number;
        wins: number;
        losses: number;
    };
    skillPoints: number;
    weeklyTasksCompleted: number;
    taskHistory?: any[];
    // Removed inventory from User type - now managed separately
    completedQuests: string[];
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (username: string, email: string, password: string, userClass: string, avatar: string, focusAreas: string[]) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    updateUser: (updatedUserData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user on app startup
    useEffect(() => {
        const loadUser = async () => {
            try {
                const USE_MOCKS = process.env.EXPO_PUBLIC_USE_MOCKS === 'true';

                // Safety timeout to prevent hang
                const timeoutPromise = new Promise<void>((_, reject) =>
                    setTimeout(() => reject(new Error('Auth load timeout')), 5000)
                );

                const loadPromise = async () => {
                    const token = await AsyncStorage.getItem('token');
                    const userData = await AsyncStorage.getItem('user');

                    if (token && userData) {
                        console.log('[Auth] 🔄 Hot reload: Restoring user session');
                        setUser(JSON.parse(userData));
                    } else if (USE_MOCKS) {
                        console.log('[Auth] 🚀 Mock Mode: Auto-logging in demo user');
                        const { MOCK_USER } = require('../mocks/userData');
                        await AsyncStorage.setItem('token', 'mock_token');
                        await AsyncStorage.setItem('user', JSON.stringify(MOCK_USER));
                        setUser(MOCK_USER);
                    } else {
                        console.log('[Auth] 🆕 Fresh start: No stored session');
                        setUser(null);
                    }
                };

                await Promise.race([loadPromise(), timeoutPromise]);
            } catch (e) {
                console.error('[AuthProvider] Failed to load user:', e);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = useCallback(async (emailOrUsername: string, password: string) => {
        try {
            const data = await authApi.login(emailOrUsername, password);
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            return { success: true };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            console.error('[Auth] Login error:', errorMessage);
            return { success: false, error: errorMessage };
        }
    }, []);

    const register = useCallback(async (username: string, email: string, password: string, userClass: string, avatar: string, focusAreas: string[]) => {
        try {
            const data = await authApi.register(username, email, password, userClass, avatar, focusAreas);
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            return { success: true };
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
            console.error('[Auth] Registration error:', errorMessage);
            return { success: false, error: errorMessage };
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            setUser(null);
        } catch (error) {
            console.error('[Auth] Logout error:', error);
            setUser(null);
        }
    }, []);

    const updateUser = useCallback(async (updatedUserData: Partial<User>) => {
        try {
            // Merge new data with existing user data to preserve fields not returned by backend
            // This prevents losing avatar, username, class, email, etc. when backend returns partial data
            const mergedUser = user ? { ...(user as object), ...updatedUserData } : (updatedUserData as User);
            await AsyncStorage.setItem('user', JSON.stringify(mergedUser));
            setUser(mergedUser as User);
        } catch (error) {
            console.error('[Auth] Update user error:', error);
        }
    }, [user]);

    const value = useMemo<AuthContextType>(() => ({
        user,
        isLoading,
        login,
        register,
        logout,
        updateUser
    }), [user, isLoading, login, register, logout, updateUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
