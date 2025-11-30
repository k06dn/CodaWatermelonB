import { motion } from "react-native-reanimated";
import { ReactNode } from "react";

interface OnboardingStepProps {
  children: ReactNode;
  className?: string;
}

export function OnboardingStep({ children, className = "" }: OnboardingStepProps) {
  return (
    <Animated.View
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={`h-full flex flex-col items-center justify-center px-6 ${className}`}
    >
      {children}
    </Animated.View>
  );
}
