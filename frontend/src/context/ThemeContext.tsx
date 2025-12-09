import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { typography } from './fonts';
import { Theme, ThemeContextType } from '../types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================
// THEME DEFINITIONS
// ============================================
const THEMES: Record<string, Theme> = {
    midnight: {
        id: 'midnight',
        background: '#0a0a23',
        surface: '#151538',
        primary: '#6c5ce7',
        secondary: '#a29bfe',
        success: '#00b894',
        danger: '#ff7675',
        warning: '#fdcb6e',
        text: '#dfe6e9',
        textSecondary: '#b2bec3',
        textLight: '#ffffff',
        border: '#2d3436',
        xpBar: '#0984e3',
        hpBar: '#d63031',
        typography,
    },
    parchment: {
        id: 'parchment',
        background: '#f7f1e3', // Lighter parchment
        surface: '#fffaf0',
        primary: '#2d3436', // Dark ink
        secondary: '#636e72',
        success: '#27ae60',
        danger: '#c0392b',
        warning: '#f39c12',
        text: '#2d3436',
        textSecondary: '#636e72',
        textLight: '#ffffff', // For buttons with primary bg
        border: '#d1ccc0',
        xpBar: '#2980b9',
        hpBar: '#c0392b',
        typography,
    },
    dungeon: {
        id: 'dungeon',
        background: '#1a1a1a', // Charcoal
        surface: '#2d2d2d',    // Stone
        primary: '#f1c40f',    // Gold
        secondary: '#95a5a6',  // Silver/Iron
        success: '#2ecc71',
        danger: '#e74c3c',
        warning: '#f39c12',
        text: '#ecf0f1',
        textSecondary: '#bdc3c7',
        textLight: '#ffffff',
        border: '#4a4a4a',
        xpBar: '#f1c40f', // XP is Gold here
        hpBar: '#c0392b',
        typography,
    },
    forest: {
        id: 'forest',
        background: '#052e16', // Deep Forest Green
        surface: '#14532d',    // Leaf Green
        primary: '#4ade80',    // Bright Emerald
        secondary: '#a3b18a',  // Sage
        success: '#86efac',
        danger: '#f87171',
        warning: '#facc15',
        text: '#f0fdf4',
        textSecondary: '#bbf7d0',
        textLight: '#ffffff',
        border: '#166534',
        xpBar: '#22c55e',
        hpBar: '#dc2626',
        typography,
    },
    bloodmoon: {
        id: 'bloodmoon',
        background: '#000000', // Pure Black
        surface: '#1c1c1c',    // Dark Grey
        primary: '#ff4757',    // Crimson
        secondary: '#747d8c',  // Steel
        success: '#2ed573',
        danger: '#ff4757',
        warning: '#ffa502',
        text: '#f1f2f6',
        textSecondary: '#ced6e0',
        textLight: '#ffffff',
        border: '#2f3542',
        xpBar: '#5352ed',
        hpBar: '#ff4757',
        typography,
    }
};

const AVAILABLE_THEMES = [
    { id: 'midnight', name: 'Midnight', icon: '🌙' },
    { id: 'parchment', name: 'Parchment', icon: '📜' },
    { id: 'dungeon', name: 'Dungeon', icon: '🏰' },
    { id: 'forest', name: 'Forest', icon: '🌲' },
    { id: 'bloodmoon', name: 'Blood Moon', icon: '🧛' },
];

export const ThemeProvider = ({ children }: any) => {
    const [currentTheme, setCurrentTheme] = useState<string>('midnight');

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('theme_id');
            if (savedTheme && THEMES[savedTheme]) {
                setCurrentTheme(savedTheme);
            }
        } catch (error) {
            console.error('Failed to load theme:', error);
        }
    };

    const setTheme = async (themeId: string) => {
        if (THEMES[themeId]) {
            setCurrentTheme(themeId);
            await AsyncStorage.setItem('theme_id', themeId);
        }
    };

    const theme = THEMES[currentTheme];

    return (
        <ThemeContext.Provider value={{
            theme,
            currentTheme,
            setTheme,
            availableThemes: AVAILABLE_THEMES
        }}>
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
