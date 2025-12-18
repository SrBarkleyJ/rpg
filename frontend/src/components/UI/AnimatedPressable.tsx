import { Pressable, ViewStyle, StyleProp, PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedPressableComponent = Animated.createAnimatedComponent(Pressable);

interface Props extends PressableProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const AnimatedPressable: React.FC<Props> = ({ children, style, ...rest }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = (event: any) => {
        scale.value = withSpring(0.96, { damping: 10, stiffness: 100 });
        rest.onPressIn?.(event);
    };

    const handlePressOut = (event: any) => {
        scale.value = withSpring(1, { damping: 10, stiffness: 100 });
        rest.onPressOut?.(event);
    };

    return (
        <AnimatedPressableComponent
            {...rest}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[style, animatedStyle]}
        >
            {children}
        </AnimatedPressableComponent>
    );
};

export default AnimatedPressable;
