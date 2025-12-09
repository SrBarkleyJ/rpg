import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

interface SpriteAnimationProps {
    spriteSheet: any; // require() source
    frameCount: number;
    frameWidth: number;
    frameHeight: number;
    fps?: number;
    loop?: boolean;
    tintColor?: string; // Optional color tint (e.g., '#00BFFF' for blue)
    onComplete?: () => void;
    style?: any;
}

// Optimized SpriteAnimation using Native Driver for opacity and safe Interval
const SpriteAnimation: React.FC<SpriteAnimationProps> = ({
    spriteSheet,
    frameCount,
    frameWidth,
    frameHeight,
    fps = 12, // Reduced default FPS for performance
    loop = false,
    tintColor,
    onComplete,
    style
}) => {
    const [currentFrame, setCurrentFrame] = useState(0);
    const opacity = useRef(new Animated.Value(1)).current;
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        const frameDuration = 1000 / fps;

        const interval = setInterval(() => {
            if (!isMounted.current) return;

            setCurrentFrame((prev) => {
                const next = prev + 1;
                if (next >= frameCount) {
                    if (loop) return 0;

                    clearInterval(interval);
                    if (onComplete) {
                        onComplete(); // Call immediately, let parent handle fade out if needed
                    }
                    return frameCount - 1;
                }
                return next;
            });
        }, frameDuration);

        return () => {
            isMounted.current = false;
            clearInterval(interval);
        };
    }, [frameCount, fps, loop, onComplete]);

    const translateX = -currentFrame * frameWidth;

    return (
        <View style={[styles.container, style, { overflow: 'hidden', width: frameWidth, height: frameHeight }]}>
            <Image
                source={spriteSheet}
                style={{
                    height: frameHeight,
                    width: frameWidth * frameCount, // Assume horizontal sprite sheet
                    transform: [{ translateX }],
                    tintColor: tintColor
                }}
                resizeMode="stretch"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 100,
    },
    frameWindow: {
        overflow: 'hidden',
    },
    spriteSheet: {
        height: '100%',
    },
});

export default SpriteAnimation;
