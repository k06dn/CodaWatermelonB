import { View, Text } from 'react-native';
import { motion } from "react-native-reanimated";
import { Map, BookOpen } from "lucide-react-native";
import { useState } from "react";
import { SensoryScoutRoom } from "./SensoryScoutRoom";

interface Resource {
  id: string;
  title: string;
  category: string;
  icon: any;
  gradient: string;
}

export function SensoryScoutView() {
  const [showSensoryScout, setShowSensoryScout] = useState(true);

  const resources: Resource[] = [
    {
      id: "1",
      title: "BSL Interpretation Guide",
      category: "Guide",
      icon: BookOpen,
      gradient: "from-[#6B5CAC] to-[#8B7BC8]",
    },
    {
      id: "2",
      title: "Campus Accessibility Map",
      category: "Resource",
      icon: Map,
      gradient: "from-[#10B981] to-[#34D399]",
    },
  ];

  if (showSensoryScout) {
    return (
      <View className="h-full">
        <SensoryScoutRoom onBack={() => setShowSensoryScout(false)} />
      </View>
    );
  }

  return (
    <View className="h-full overflow-y-auto bg-[#FFFBF5]">
      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <Text className="text-[#10B981]">Sensory Scout</Text>
        <Text className="text-[#6B5CAC]">
          Find accessible spaces with community ratings
        </Text>
      </View>

      {/* Main Sensory Scout CTA */}
      <View className="px-6 mb-6">
        <Animated.View
          onPress={() => setShowSensoryScout(true)}
          className="w-full bg-gradient-to-br from-[#10B981]/20 to-[#34D399]/20 backdrop-blur-xl rounded-3xl p-6 border border-[#10B981]/30 shadow-lg hover:bg-[#10B981]/30 focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] transition-all"
          whileTap={{ scale: 0.98 }}
          aria-label="Open Sensory Scout room reviews"
        >
          <View className="flex items-center gap-4">
            <View className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#34D399] flex items-center justify-center shadow-md" aria-hidden="true">
              <Map className="w-8 h-8 text-white" strokeWidth={2} />
            </View>
            <View className="flex-1 text-left">
              <Text className="text-[#2A0098] mb-2">Browse Room Reviews</Text>
              <Text className="text-[#6B5CAC] text-sm">
                Community-rated accessibility for lecture halls, seminar rooms, and study spaces
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Quick Resources Section */}
      <View className="px-6 mb-6">
        <Text className="text-[#2A0098] mb-3">Quick Resources</Text>
        <View className="grid grid-cols-2 gap-3">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <Animated.View
                key={resource.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/50 backdrop-blur-xl rounded-2xl p-4 border border-white/60 shadow-lg hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] transition-all text-left"
                aria-label={`Open ${resource.title}`}
              >
                <View className={`w-10 h-10 rounded-xl bg-gradient-to-br ${resource.gradient} flex items-center justify-center mb-3 shadow-md`} aria-hidden="true">
                  <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                </View>
                <Text className="text-[#2A0098] text-sm mb-1">{resource.title}</Text>
                <Text className="text-[#6B5CAC] text-xs">{resource.category}</Text>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </View>
  );
}