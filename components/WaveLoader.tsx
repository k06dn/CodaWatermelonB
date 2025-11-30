import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useSharedValue } from 'react-native-reanimated';

function WaveBar({ delay }: { delay: number }) {
  const height = useSharedValue(20);

  useEffect(() => {
    height.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(100, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(20, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: `${height.value}%`,
  }));

  return (
    <Animated.View
      className="w-3 bg-gradient-to-t from-[#FF85A2] to-[#FFB3C6] rounded-full"
      style={animatedStyle}
    />
  );
}

export function WaveLoader() {
  return (
    <View className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-b from-[#FFFBF5] to-[#FFE5F0] px-6">
      {/* Logo/Title */}
      <View className="mb-16 text-center">
        <Text className="text-[#2A0098] mb-2 text-4xl font-bold">Coda</Text>
        <Text className="text-[#6B5CAC] text-base">Your independence companion</Text>
      </View>

      {/* Animated Waves */}
      <View className="relative w-full max-w-[200px] h-24 flex flex-row items-end justify-center gap-2">
        {[...Array(5)].map((_, i) => (
          <WaveBar key={i} delay={i * 150} />
        ))}
      </View>

      {/* Loading Text */}
      <Text className="text-[#6B5CAC] mt-12 text-sm">
        Loading your experience...
      </Text>
    </View>
  );
}
