import { View, Text } from 'react-native';
import { Button } from "./ui/button";
import { Calendar, FileText } from "lucide-react-native";

export function NextUpCard() {
  return (
    <View className="bg-gradient-to-br from-white to-[#FAF8FF] rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow border border-[#F0E8FF]">
      <View className="flex items-start gap-4 mb-5">
        <View className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#6B5CAC] to-[#8B7CAC] rounded-xl flex items-center justify-center shadow-sm">
          <Calendar className="w-6 h-6 text-white" strokeWidth={2} />
        </View>
        
        <View className="flex-1 min-w-0">
          <View className="inline-block px-3 py-1 bg-[#D8FDCC] rounded-full text-xs text-[#2A0098] mb-2" style={{ fontWeight: '600' }}>
            Next Up
          </View>
          <Text className="text-sm text-[#666666] mb-1.5">
            10:00 AM
          </Text>
          <Text className="text-base text-[#2A0098]" style={{ fontWeight: '600' }}>
            Lecture - Intro to Phonetics
          </Text>
        </View>
      </View>
      
      <View className="flex gap-2.5">
        <Button className="flex-1 bg-[#2A0098] hover:bg-[#1F0070] text-white rounded-xl h-10 shadow-sm hover:shadow-md transition-all" style={{ fontWeight: '600', fontSize: '0.875rem' }}>
          <FileText className="w-4 h-4 mr-1.5" strokeWidth={2} />
          Transcription Hub
        </Button>
        <Button variant="outline" className="flex-1 border-2 border-[#6B5CAC] text-[#6B5CAC] hover:bg-[#6B5CAC] hover:text-white rounded-xl h-10 bg-transparent transition-all" style={{ fontWeight: '600', fontSize: '0.875rem' }}>
          Launchpad
        </Button>
      </View>
    </View>
  );
}
