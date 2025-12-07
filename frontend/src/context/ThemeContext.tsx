import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { typography } from './fonts';

const ThemeContext = createContext<any>({});

// Refined Dark Theme (Midnight Blue/Deep Space)
const darkTheme = {
    background: '#0a0a23', // Deep midnight blue
    surface: '#151538',    // Slightly lighter blue/purple for cards
    primary: '#6c5ce7',    // Vibrant purple for accents/buttons
    secondary: '#a29bfe',  // Soft lavender for secondary text/icons
    success: '#00b894',    // Bright teal green
    danger: '#ff7675',     // Soft red
    warning: '#fdcb6e',    // Muted gold
    text: '#dfe6e9',       // Off-white text (easier on eyes)
    textSecondary: '#b2bec3',
    textLight: '#ffffff',
    border: '#2d3436',     // Dark grey border
    xpBar: '#0984e3',
    hpBar: '#d63031',
    typography,
};

// Refined Light Theme (Parchment/Map)
const lightTheme = {
    background: '#d0ccc940', // Parchment color
    surface: '#ffffff',    // White cards
    primary: '#cdd62b79',    // Dark slate blue (Classic RPG ink color)
    secondary: '#8e44ad',  // Purple accent
    success: '#27ae60',
    danger: '#c0392b',
    warning: '#f39c12',
    text: '#0e0f0fff',       // Dark grey text
    textSecondary: '#353839ff',
    textLight: '#f7f1e3',  // Light text for dark buttons
    border: '#d1ccc0',     // Light beige border
    xpBar: '#2980b9',
    hpBar: '#c0392b',
    typography,
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
