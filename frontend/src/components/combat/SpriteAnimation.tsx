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

const SpriteAnimation: React.FC<SpriteAnimationProps> = ({
    spriteSheet,
    frameCount,
    frameWidth,
    frameHeight,
    fps = 24,
    loop = false,
    tintColor,
    onComplete,
    style
}) => {
    const [currentFrame, setCurrentFrame] = useState(0);
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const frameDuration = 1000 / fps; // milliseconds per frame

        const interval = setInterval(() => {
            setCurrentFrame((prevFrame) => {
                const nextFrame = prevFrame + 1;

                if (nextFrame >= frameCount) {
                    if (loop) {
                        return 0;
                    } else {
                        clearInterval(interval);
                        if (onComplete) {
                            // Fade out before completing
                            Animated.timing(opacity, {
                                toValue: 0,
                                duration: 200,
                                useNativeDriver: true,
                            }).start(() => onComplete());
                        }
                        return frameCount - 1; // Stay on last frame
                    }
                }

                return nextFrame;
            });
        }, frameDuration);

        return () => clearInterval(interval);
    }, [frameCount, fps, loop, onComplete]);

    // Calculate the horizontal offset for the current frame
    const translateX = -currentFrame * frameWidth;

    return (
        <Animated.View style={[styles.container, style, { opacity }]}>
            <View style={[styles.frameWindow, { width: frameWidth, height: frameHeight }]}>
                <Image
                    source={spriteSheet}
                    style={[
                        styles.spriteSheet,
                        {
                            transform: [{ translateX }],
                            tintColor: tintColor, // Apply blue tint for thunder
                        },
                    ]}
                    resizeMode="stretch"
                />
            </View>
        </Animated.View>
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
