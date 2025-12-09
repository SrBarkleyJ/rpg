import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Utility for handling Haptic Feedback across the app.
 * Fails silently on unsupported platforms/devices.
 */

// Light vibration suitable for UI interactions (button presses, tab switches)
export const hapticSelection = async () => {
    if (Platform.OS === 'web') return;
    try {
        await Haptics.selectionAsync();
    } catch (error) {
        // Ignore errors on devices without haptics
    }
};

// Medium vibration for success/warning actions
export const hapticImpactLight = async () => {
    if (Platform.OS === 'web') return;
    try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) { }
};

export const hapticImpactMedium = async () => {
    if (Platform.OS === 'web') return;
    try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) { }
};

export const hapticImpactHeavy = async () => {
    if (Platform.OS === 'web') return;
    try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) { }
};

// Notification vibrations
export const hapticSuccess = async () => {
    if (Platform.OS === 'web') return;
    try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) { }
};

export const hapticError = async () => {
    if (Platform.OS === 'web') return;
    try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) { }
};

export const hapticWarning = async () => {
    if (Platform.OS === 'web') return;
    try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) { }
};
