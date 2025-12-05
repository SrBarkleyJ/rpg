import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext<any>({});

// Dark theme colors (current)
const darkTheme = {
    background: '#111142ff',
    surface: '#16213e',
    primary: '#0f3460',
    secondary: '#533483',
    success: '#2ecc71',
    danger: '#e74c3c',
    warning: '#f39c12',
    text: '#ffffffff',
    textLight: '#ffffffff',
    border: '#34495e',
    xpBar: '#4169e1',
    hpBar: '#b22222',
};

// Light theme colors
const lightTheme = {
    background: '#f5f5f5',
    surface: '#ffffff',
    primary: '#411b1bff',
    secondary: '#9b59b6',
    success: '#000000ff',
    danger: '#c0392b',
    warning: '#f39c12',
    text: '#2c3e50',
    textLight: '#ffffff',
    border: '#bdc3c7',
    xpBar: '#4169e1',
    hpBar: '#b22222',
};

export const ThemeProvider = ({ children }: any) => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('theme');
            if (savedTheme) {
                setIsDark(savedTheme === 'dark');
            }
        } catch (error) {
            console.error('Failed to load theme:', error);
        }
    };

    const toggleTheme = async () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
