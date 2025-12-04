import React, { memo } from 'react';
import { Image, StyleSheet, ImageSourcePropType } from 'react-native';

const AVATAR_MAP = {
    img1: require('../../../assets/images/classes/img1.png'),
    img2: require('../../../assets/images/classes/img2.png'),
    img3: require('../../../assets/images/classes/img3.png'),
    img4: require('../../../assets/images/classes/img4.png'),
    img5: require('../../../assets/images/classes/img5.png'),
    img6: require('../../../assets/images/classes/img6.png'),
    img7: require('../../../assets/images/classes/img7.png'),
    img8: require('../../../assets/images/classes/img8.png'),
    img9: require('../../../assets/images/classes/img9.png'),
    img10: require('../../../assets/images/classes/img10.png'),
};

interface PlayerAvatarProps {
    avatarKey: string;
    size?: number;
    animated?: boolean;
    style?: any;
}

const PlayerAvatar = memo(({ 
    avatarKey, 
    size = 150, 
    animated = false, 
    style 
}: PlayerAvatarProps) => {
    const getPlayerAvatar = () => {
        const key = avatarKey || 'img1';
        return AVATAR_MAP[key as keyof typeof AVATAR_MAP] || AVATAR_MAP.img1;
    };

    const avatarSource: ImageSourcePropType = getPlayerAvatar();

    if (animated) {
        // Aquí podrías envolver en Animated.View si necesitas animaciones
        return (
            <Image
                source={avatarSource}
                style={[
                    styles.image,
                    { width: size, height: size },
                    style
                ]}
                resizeMode="contain"
            />
        );
    }

    return (
        <Image
            source={avatarSource}
            style={[
                styles.image,
                { width: size, height: size },
                style
            ]}
            resizeMode="contain"
        />
    );
});

const styles = StyleSheet.create({
    image: {
        // Estilos base
    },
});

export default PlayerAvatar;