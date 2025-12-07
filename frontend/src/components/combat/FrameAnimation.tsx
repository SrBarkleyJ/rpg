import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { StyleSheet, Animated, ImageSourcePropType, Easing, View } from 'react-native';

interface FrameAnimationProps {
    frames: ImageSourcePropType[];
    fps?: number;
    loop?: boolean;
    size?: number;
    tintColor?: string;
    onComplete?: () => void;
    style?: any;
    travelling?: boolean;
    rotation?: number;
}

const FrameAnimation: React.FC<FrameAnimationProps> = ({
    frames,
    fps = 24,
    loop = false,
    size = 100,
    tintColor,
    onComplete,
    style,
    travelling = false,
    rotation = 0
}) => {
    // Shared animated value for frame progress
    const progress = useRef(new Animated.Value(0)).current;

    // Transform animations
    const translateX = useRef(new Animated.Value(travelling ? -150 : 0)).current;

    // Fade out opacity for cleanup
    const containerOpacity = useRef(new Animated.Value(1)).current;

    const handleComplete = useCallback(() => {
        if (onComplete) {
            Animated.timing(containerOpacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }).start(() => onComplete());
        }
    }, [onComplete, containerOpacity]);

    useEffect(() => {
        if (!frames || frames.length === 0) return;

        // Reset
        progress.setValue(0);
        containerOpacity.setValue(1);
        translateX.setValue(travelling ? -150 : 0);

        // Travelling Animation
        if (travelling) {
            const moveDuration = (frames.length / fps) * 1000;
            Animated.timing(translateX, {
                toValue: 150,
                duration: moveDuration,
                useNativeDriver: true, // Native Driver Enabled
                easing: Easing.linear
            }).start();
        }

        // Frame Animation
        const totalDuration = (frames.length / fps) * 1000;

        const animation = Animated.timing(progress, {
            toValue: frames.length,
            duration: totalDuration,
            easing: Easing.linear,
            useNativeDriver: true // Native Driver Enabled!
        });

        if (loop) {
            Animated.loop(animation).start();
        } else {
            animation.start(({ finished }) => {
                if (finished) {
                    handleComplete();
                }
            });
        }

        return () => {
            progress.stopAnimation();
            translateX.stopAnimation();
        };
    }, [frames, fps, loop, handleComplete, containerOpacity, travelling, translateX, progress]);

    if (!frames || frames.length === 0) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                style,
                {
                    opacity: containerOpacity,
                    transform: [{ translateX: travelling ? translateX : 0 }],
                    width: size,
                    height: size,
                }
            ]}
        >
            {frames.map((frameSource, index) => {
                // Interpolate opacity for each frame based on progress
                // Frame visible when progress is between [index, index+1)
                const opacity = progress.interpolate({
                    inputRange: [index - 0.01, index, index + 0.99, index + 1],
                    outputRange: [0, 1, 1, 0],
                    extrapolate: 'clamp'
                });

                return (
                    <Animated.Image
                        key={index}
                        source={frameSource}
                        style={[
                            styles.frame,
                            {
                                width: size,
                                height: size,
                                tintColor: tintColor,
                                transform: [{ rotate: `${rotation}deg` }],
                                opacity: opacity, // Animated opacity
                                position: 'absolute' // Stack them
                            },
                        ]}
                        resizeMode="contain"
                    />
                );
            })}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative', // Context for absolute children
    },
    frame: {
        // Absolute position is applied inline
    },
});

export default FrameAnimation;
