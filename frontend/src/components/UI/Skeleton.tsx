import React, { useEffect } from 'react';
import { View, StyleProp, ViewStyle, StyleSheet, DimensionValue } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';

interface SkeletonProps {
    width?: DimensionValue;
    height?: DimensionValue;
    style?: StyleProp<ViewStyle>;
    borderRadius?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({ width, height, style, borderRadius = 4 }) => {
    const { theme } = useTheme();
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        // Disabled infinite loop to prevent potential GPU driver crashes and reduce load
        // opacity.value = withRepeat(...) 
        opacity.value = 0.5; // Static opacity
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    width: width,
                    height: height,
                    backgroundColor: theme.text, // Use text color as base for skeleton against background
                    borderRadius: borderRadius,
                    opacity: 0.3
                },
                style,
                animatedStyle
            ]}
        />
    );
};

const styles = StyleSheet.create({
    skeleton: {
        overflow: 'hidden',
    },
});

export default Skeleton;
