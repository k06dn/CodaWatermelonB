import { View, Text } from 'react-native';
import { motion } from "react-native-reanimated";

export function LoadingScreen() {
  return (
    <View className="fixed inset-0 bg-[#FFFBF5] flex items-center justify-center z-50">
      <View className="text-center">
        {/* Logo/Brand */}
        <Animated.View
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Text className="text-[#2A0098] mb-2">Coda</Text>
          <Text className="text-[#6B5CAC]">Your campus companion</Text>
        </Animated.View>

        {/* Wave Animation */}
        <View className="relative w-48 h-24 mx-auto">
          {[0, 1, 2, 3, 4].map((i) => (
            <Animated.View
              key={i}
              className="absolute bottom-0 w-8 bg-gradient-to-t from-[#FF85A2] to-[#FFB3C6] rounded-full"
              style={{
                left: `${i * 20}%`,
                transformOrigin: "bottom",
              }}
              animate={{
                height: ["20%", "80%", "20%"],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </View>

        {/* Loading Text */}
        <Animated.View
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-[#6B5CAC] text-sm mt-8"
        >
          Loading...
        </Animated.View>
      </View>
    </View>
  );
}
