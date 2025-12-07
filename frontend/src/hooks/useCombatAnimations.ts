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
        // ===== WARRIOR - Direct attacks =====
        if (['bash', 'execute', 'ground_slam', 'charge'].includes(skillId)) {
            playBasicAttackAnimation();
        }
        // ===== WARRIOR - Buffs (flash naranja) =====
        else if (['berserk', 'war_cry'].includes(skillId)) {
            setFlashColor('rgba(255, 140, 0, 0.3)');
            Animated.sequence([
                Animated.timing(flashOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
                Animated.timing(flashOpacity, { toValue: 0, duration: 350, useNativeDriver: true }),
            ]).start();
        }
        // ===== MAGE - Fire/Thunder (flash rojo/dorado) =====
        else if (['fireball', 'meteor', 'thunder_strike'].includes(skillId)) {
            playSpecialAttackAnimation(userClass);
        }
        // ===== MAGE - Ice/Electric (flash cian) =====
        else if (['ice_shard', 'chain_lightning'].includes(skillId)) {
            setFlashColor('rgba(0, 255, 255, 0.2)');
            Animated.sequence([
                Animated.timing(flashOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
                Animated.timing(flashOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
            ]).start();
        }
        // ===== MAGE - Arcane (flash violeta) =====
        else if (['arcane_bolt'].includes(skillId)) {
            setFlashColor('rgba(153, 50, 204, 0.3)');
            Animated.sequence([
                Animated.timing(flashOpacity, { toValue: 1, duration: 100, useNativeDriver: true }),
                Animated.timing(flashOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
            ]).start();
        }
        // ===== ROGUE - Quick attacks =====
        else if (['double_stab', 'backstab', 'assassinate', 'blade_dance'].includes(skillId)) {
            playBasicAttackAnimation();
        }
        // ===== ROGUE - Shadow (flash gris oscuro) =====
        else if (['shadow_strike'].includes(skillId)) {
            setFlashColor('rgba(47, 47, 47, 0.4)');
            Animated.sequence([
                Animated.timing(flashOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
                Animated.timing(flashOpacity, { toValue: 0, duration: 350, useNativeDriver: true }),
            ]).start();
        }
        // ===== ROGUE - Poison (flash violeta veneno) =====
        else if (['poison_tip'].includes(skillId)) {
            setFlashColor('rgba(148, 0, 211, 0.3)');
            Animated.sequence([
                Animated.timing(flashOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
                Animated.timing(flashOpacity, { toValue: 0, duration: 350, useNativeDriver: true }),
            ]).start();
        }
        // Default
        else {
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