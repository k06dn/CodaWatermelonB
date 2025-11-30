import { View, Text } from 'react-native';
import { Button } from "./ui/button";
import { Timer } from "lucide-react-native";

export function FocusCard() {
  return (
    <View className="bg-gradient-to-br from-white to-[#FFF8F8] rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow border border-[#FFE8E8]">
      <View className="flex items-start gap-4 mb-4">
        <View className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#FF85A2] to-[#FFB3C6] rounded-xl flex items-center justify-center shadow-sm">
          <Timer className="w-6 h-6 text-white" strokeWidth={2} />
        </View>
        
        <View className="flex-1 min-w-0">
          <View className="inline-block px-3 py-1 bg-[#D8FDCC] rounded-full text-xs text-[#2A0098] mb-2" style={{ fontWeight: '600' }}>
            Focus
          </View>
          <Text className="text-base mb-4 text-[#2A0098]" style={{ lineHeight: '1.4' }}>
            You have a study block at <Text className="text-[#6B5CAC]" style={{ fontWeight: '600' }}>2 PM</Text>. 
            <br />Ready to start a Pomodoro session?
          </Text>
          
          <Button className="bg-[#2A0098] hover:bg-[#1F0070] text-white rounded-xl h-10 px-6 shadow-sm hover:shadow-md transition-all" style={{ fontWeight: '600', fontSize: '0.875rem' }}>
            <Timer className="w-4 h-4 mr-1.5" strokeWidth={2} />
            Start Session
          </Button>
        </View>
      </View>
    </View>
  );
}
