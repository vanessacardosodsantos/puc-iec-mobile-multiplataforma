// src/components/HeartButton.tsx
//
// CAMADA COMPONENTS — botão de favoritar com animação Reanimated.
// ATIVIDADE 2 — TASK 8 (escolha A: Heart pop)
//
// Animação: ao tocar, o ❤️ escala pra 1.4 (timing rápido) e volta pra 1
// com spring (overshoot natural). withSequence encadeia as duas animações.
//
// Doc: https://docs.swmansion.com/react-native-reanimated/

import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  active: boolean;
  onPress: () => void;
};

export default function HeartButton({ active, onPress }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = (e: any) => {
    e.stopPropagation();
    scale.value = withSequence(
      withTiming(1.4, { duration: 120 }),
      withSpring(1, { damping: 4, stiffness: 180 }),
    );
    onPress();
  };

  return (
    <Pressable onPress={handlePress} style={styles.button} hitSlop={8}>
      <Animated.View style={animatedStyle}>
        <Text style={styles.icon}>{active ? '❤️' : '🤍'}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8 },
  icon: { fontSize: 24 },
});