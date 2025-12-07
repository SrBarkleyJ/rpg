import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { en } from '../i18n/en';
import { es } from '../i18n/es';

const LanguageContext = createContext<any>({});

export const translations = {
    en,
    es
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<'en' | 'es'>('es');

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLang = await AsyncStorage.getItem('language');
            if (savedLang === 'en' || savedLang === 'es') {
                setLanguage(savedLang);
            }
        } catch (error) {
            console.error('Failed to load language:', error);
        }
    };

    const toggleLanguage = async () => {
        const newLang = language === 'en' ? 'es' : 'en';
        setLanguage(newLang);
        await AsyncStorage.setItem('language', newLang);
    };

    const translateItem = (itemName: string) => {
        // Remove spaces for key lookup "Iron Sword" -> "item_IronSword"
        const key = `item_${itemName.replace(/\s+/g, '')}`;
        // @ts-ignore
        return translations[language][key] || itemName;
    };

    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t, translateItem }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};
