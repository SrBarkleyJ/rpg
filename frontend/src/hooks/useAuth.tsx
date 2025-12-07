import React, { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authApi from '../api/authApi';

const AuthContext = createContext<any>({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                // Safety timeout
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Auth load timeout')), 5000)
                );

                const loadPromise = async () => {
                    const token = await AsyncStorage.getItem('token');
                    const userData = await AsyncStorage.getItem('user');
                    if (token && userData) {
                        setUser(JSON.parse(userData));
                    }
                };

                await Promise.race([loadPromise(), timeoutPromise]);
            } catch (e) {
                console.error('AuthProvider: Failed to load user', e);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (emailOrUsername, password) => {
        try {
            const data = await authApi.login(emailOrUsername, password);
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (username, email, password, userClass, avatar, focusAreas) => {
        try {
            const data = await authApi.register(username, email, password, userClass, avatar, focusAreas);
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = async (updatedUserData: any) => {
        // Merge new data with existing user data to preserve fields not returned by backend
        // This prevents losing avatar, username, class, email, etc. when backend returns partial data
        const mergedUser = user ? { ...(user as object), ...updatedUserData } : updatedUserData;
        await AsyncStorage.setItem('user', JSON.stringify(mergedUser));
        setUser(mergedUser);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
