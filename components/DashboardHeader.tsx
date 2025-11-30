import { View, Text, TouchableOpacity } from 'react-native';
import { User } from "lucide-react-native";

export function DashboardHeader() {
  return (
    <View className="flex items-center justify-between px-6 pt-6 pb-8">
      <Text className="text-3xl text-[#2A0098]">
        Hello, <Text className="text-[#6B5CAC]">Chen</Text>
      </Text>
      <TouchableOpacity className="w-11 h-11 rounded-full bg-gradient-to-br from-[#6B5CAC] to-[#8B7CAC] flex items-center justify-center hover:opacity-90 transition-opacity shadow-md">
        <User className="w-5 h-5 text-white" strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
}
