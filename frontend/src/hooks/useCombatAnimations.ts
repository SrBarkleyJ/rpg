import { useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

export const useCombatAnimations = () => {
    // Enemy animations
    const enemyShake = useRef(new Animated.Value(0)).current;
    const enemyOpacity = useRef(new Animated.Value(1)).current;
    const damageNumberOpacity = useRef(new Animated.Value(0)).current;
    const damageNumberY = useRef(new Animated.Value(0)).current;

    // Player animations
    const playerTranslateX = useRef(new Animated.Value(0)).current;
    const playerScale = useRef(new Animated.Value(1)).current;
    const flashOpacity = useRef(new Animated.Value(0)).current;
    const [flashColor, setFlashColor] = useState('white');

    const playEnemyDamageAnimation = (damage: number) => {
        // Shake animation
        Animated.sequence([
            Animated.timing(enemyShake, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(enemyShake, {
                toValue: -10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(enemyShake, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(enemyShake, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true,
            }),
        ]).start();

        // Damage number animation
        damageNumberY.setValue(0);
        damageNumberOpacity.setValue(1);
        Animated.parallel([
            Animated.timing(damageNumberY, {
                toValue: -50,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(damageNumberOpacity, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const playEnemyDefeatAnimation = () => {
        Animated.timing(enemyOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    const playBasicAttackAnimation = () => {
        Animated.sequence([
            Animated.timing(playerTranslateX, {
                toValue: 50,
                duration: 100,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }),
            Animated.timing(playerTranslateX, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
                easing: Easing.in(Easing.ease),
            }),
        ]).start();
    };

    const playSpecialAttackAnimation = (userClass?: string) => {
        if (userClass === 'warrior') {
            // Earthquake: Shake + Red Flash
            setFlashColor('rgba(255, 0, 0, 0.3)');
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(flashOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
                    Animated.timing(flashOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
                ]),
                Animated.sequence([
                    Animated.timing(playerTranslateX, { toValue: 10, duration: 50, useNativeDriver: true }),
                    Animated.timing(playerTranslateX, { toValue: -10, duration: 50, useNativeDriver: true }),
                    Animated.timing(playerTranslateX, { toValue: 10, duration: 50, useNativeDriver: true }),
                    Animated.timing(playerTranslateX, { toValue: -10, duration: 50, useNativeDriver: true }),
                    Animated.timing(playerTranslateX, { toValue: 0, duration: 50, useNativeDriver: true }),
                ])
            ]).start();
        } else if (userClass === 'mage') {
            // Arcane Blast: Scale + Blue Flash
            setFlashColor('rgba(0, 0, 255, 0.3)');
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(flashOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
                    Animated.timing(flashOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
                ]),
                Animated.sequence([
                    Animated.timing(playerScale, { toValue: 1.5, duration: 300, useNativeDriver: true }),
                    Animated.timing(playerScale, { toValue: 1, duration: 200, useNativeDriver: true }),
                ])
            ]).start();
        } else if (userClass === 'rogue') {
            // Shadow Strike: Fade + Dash
            setFlashColor('rgba(0, 0, 0, 0.5)');
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(flashOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
                    Animated.timing(flashOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
                ]),
                Animated.sequence([
                    Animated.timing(playerTranslateX, { toValue: 100, duration: 50, useNativeDriver: true }),
                    Animated.timing(playerTranslateX, { toValue: -100, duration: 0, useNativeDriver: true }),
                    Animated.timing(playerTranslateX, { toValue: 0, duration: 100, useNativeDriver: true }),
                ])
            ]).start();
        } else {
            // Default fallback
            playBasicAttackAnimation();
        }
    };

    const playSkillAnimation = (skillId: string, userClass?: string) => {
        if (['bash', 'execute', 'double_stab', 'assassinate'].includes(skillId)) {
            playBasicAttackAnimation();
        } else if (['berserk', 'iron_skin', 'fireball', 'thunder_strike'].includes(skillId)) {
            playSpecialAttackAnimation(userClass);
        } else if (skillId === 'heal') {
            setFlashColor('rgba(0, 255, 0, 0.3)');
            Animated.sequence([
                Animated.timing(flashOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
                Animated.timing(flashOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
            ]).start();
        } else {
            playBasicAttackAnimation();
        }
    };

    const playPlayerHurtAnimation = () => {
        setFlashColor('rgba(255, 0, 0, 0.3)');
        Animated.sequence([
            Animated.timing(flashOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
            Animated.timing(flashOpacity, { toValue: 0, duration: 100, useNativeDriver: true }),
            Animated.timing(flashOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
            Animated.timing(flashOpacity, { toValue: 0, duration: 100, useNativeDriver: true }),
        ]).start();
    };

    const playFlashAnimation = (color: string, duration: number = 200) => {
        setFlashColor(color);
        Animated.timing(flashOpacity, {
            toValue: 1,
            duration: duration / 2,
            useNativeDriver: true,
        }).start(() => {
            Animated.timing(flashOpacity, {
                toValue: 0,
                duration: duration / 2,
                useNativeDriver: true,
            }).start();
        });
    };

    return {
        enemyShake,
        enemyOpacity,
        damageNumberOpacity,
        damageNumberY,
        playerTranslateX,
        playerScale,
        flashOpacity,
        flashColor,
        setFlashColor,
        playEnemyDamageAnimation,
        playEnemyDefeatAnimation,
        playBasicAttackAnimation,
        playSpecialAttackAnimation,
        playSkillAnimation,
        playPlayerHurtAnimation,
        playFlashAnimation,
    };
};