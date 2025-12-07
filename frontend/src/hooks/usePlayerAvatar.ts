import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AVATAR_STORAGE_KEY = '@player_avatar';

export const usePlayerAvatar = (userAvatarKey: string) => {
    const [avatarKey, setAvatarKey] = useState<string>(userAvatarKey || 'img1');

    useEffect(() => {
        // User data from backend is source of truth
        if (userAvatarKey && userAvatarKey !== avatarKey) {
            setAvatarKey(userAvatarKey);
            // Update AsyncStorage to match
            AsyncStorage.setItem(AVATAR_STORAGE_KEY, userAvatarKey).catch(error => {
                console.error('Error saving avatar:', error);
            });
        }
    }, [userAvatarKey]); // REMOVED avatarKey from dependencies to prevent infinite loop

    const updateAvatar = async (newAvatarKey: string) => {
        try {
            setAvatarKey(newAvatarKey);
            await AsyncStorage.setItem(AVATAR_STORAGE_KEY, newAvatarKey);
        } catch (error) {
            console.error('Error saving avatar:', error);
        }
    };

    return { avatarKey, updateAvatar };
};