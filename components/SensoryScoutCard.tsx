import { View, Text } from 'react-native';
import { Star, MapPin, ChevronRight } from "lucide-react-native";

interface SensoryScoutCardProps {
  onClick?: () => void;
}

export function SensoryScoutCard({ onClick }: SensoryScoutCardProps) {
  return (
    <View 
      onPress={onClick}
      className="bg-gradient-to-br from-white to-[#F8FFF8] rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow cursor-pointer group border border-[#E8FFE8]"
    >
      <View className="flex items-start gap-4 mb-4">
        <View className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#D8FDCC] to-[#B8EDC2] rounded-xl flex items-center justify-center shadow-sm">
          <MapPin className="w-6 h-6 text-[#2A0098]" strokeWidth={2} />
        </View>
        
        <View className="flex-1 min-w-0">
          <View className="inline-block px-3 py-1 bg-[#EDE5FF] rounded-full text-xs text-[#2A0098] mb-2" style={{ fontWeight: '600' }}>
            Sensory Scout
          </View>
          <Text className="text-base mb-3.5 text-[#2A0098]" style={{ fontWeight: '600', lineHeight: '1.4' }}>
            Your next lecture is in <br />
            <Text className="text-[#6B5CAC]">Engineering Building - Lecture Theatre A</Text>
          </Text>
          
          <View className="space-y-2">
            <Text className="text-sm text-[#666666]">
              Visual Access Score
            </Text>
            <View className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= 4
                      ? 'fill-[#D8FDCC] text-[#2A0098] stroke-[#2A0098]'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                  strokeWidth={1.5}
                />
              ))}
              <Text className="ml-1.5 text-sm text-[#2A0098]" style={{ fontWeight: '600' }}>
                4/5
              </Text>
            </View>
          </View>
        </View>
        
        <ChevronRight className="w-5 h-5 text-[#666666] group-hover:text-[#6B5CAC] transition-colors flex-shrink-0 mt-0.5" strokeWidth={2} />
      </View>
      
      <Text className="text-sm text-[#666666]">
        Tap to see the accessibility seating map
      </Text>
    </View>
  );
}
