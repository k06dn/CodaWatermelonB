import { View, Text } from 'react-native';
import { motion } from "react-native-reanimated";
import { LucideIcon } from "lucide-react-native";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Animated.View
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      <View className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF85A2]/20 to-[#FFB3C6]/20 backdrop-blur-sm flex items-center justify-center mb-4" aria-hidden="true">
        <Icon className="w-10 h-10 text-[#FF85A2]" strokeWidth={1.5} aria-hidden="true" />
      </View>
      <Text className="text-[#2A0098] mb-2">{title}</Text>
      <Text className="text-[#6B5CAC] text-sm max-w-xs mb-6">{description}</Text>
      {action && (
        <button
          onPress={action.onClick}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF85A2] to-[#FFB3C6] text-white text-sm leading-none shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#2A0098] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] transition-all active:scale-95"
        >
          {action.label}
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}
