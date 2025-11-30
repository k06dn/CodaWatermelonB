import { View, Text } from 'react-native';
import { useState } from "react";
import { motion } from "react-native-reanimated";
import { Timer, Rocket, Users } from "lucide-react-native";
import { HapticPomodoro } from "./HapticPomodoro";
import { LaunchpadView } from "./LaunchpadView";
import { CommunityTab } from "./CommunityTab";

type StudyTab = "pomodoro" | "launchpad" | "community";

interface StudyViewProps {
  userName?: string;
}

export function StudyView({ userName = "there" }: StudyViewProps) {
  const [activeTab, setActiveTab] = useState<StudyTab>("pomodoro");

  const tabs = [
    {
      id: "pomodoro" as StudyTab,
      label: "Haptic Pomodoro",
      icon: Timer,
      description: "Silent study timer",
    },
    {
      id: "launchpad" as StudyTab,
      label: "Launchpad",
      icon: Rocket,
      description: "Pre-lecture prep",
    },
    {
      id: "community" as StudyTab,
      label: "Community",
      icon: Users,
      description: "Events & groups",
    },
  ];

  return (
    <View className="h-full flex flex-col bg-[#FFFBF5]">
      {/* Header - glassmorphic */}
      <View className="px-6 pt-6 pb-4 bg-white/60 backdrop-blur-xl border-b border-[#2A0098]/10">
        <View className="mb-4">
          <Text className="text-[#2A0098]">Study</Text>
          <Text className="text-[#6B5CAC]">Tools for independent learning</Text>
        </View>

        {/* Tab Navigation */}
        <View 
          className="flex gap-2 bg-white/40 backdrop-blur-sm p-1 rounded-xl border border-white/60"
          role="tablist"
          aria-label="Study tools"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            // Different colors for each tab
            const getTabColors = () => {
              if (tab.id === "pomodoro") {
                return isActive 
                  ? "bg-gradient-to-br from-[#FF85A2] to-[#FFB3C6] text-white shadow-lg"
                  : "text-[#FF85A2] hover:bg-white/50";
              }
              if (tab.id === "launchpad") {
                return isActive
                  ? "bg-gradient-to-br from-[#2A0098] to-[#6B5CAC] text-white shadow-lg"
                  : "text-[#2A0098] hover:bg-white/50";
              }
              // community
              return isActive
                ? "bg-gradient-to-br from-[#10B981] to-[#34D399] text-white shadow-lg"
                : "text-[#10B981] hover:bg-white/50";
            };
            
            return (
              <button
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] ${getTabColors()}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tab.id}-panel`}
                id={`${tab.id}-tab`}
                tabIndex={isActive ? 0 : -1}
              >
                <Icon 
                  className={`w-5 h-5 ${isActive ? "text-white" : ""}`} 
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <Text className="text-xs">
                  {tab.id === "pomodoro" ? "Timer" : tab.id === "launchpad" ? "Prep" : "Community"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Tab Content */}
      <View className="flex-1 overflow-hidden">
        {/* Pomodoro Panel */}
        <div
          role="tabpanel"
          id="pomodoro-panel"
          aria-labelledby="pomodoro-tab"
          hidden={activeTab !== "pomodoro"}
          className="h-full"
        >
          {activeTab === "pomodoro" && <HapticPomodoro />}
        </View>

        {/* Launchpad Panel */}
        <div
          role="tabpanel"
          id="launchpad-panel"
          aria-labelledby="launchpad-tab"
          hidden={activeTab !== "launchpad"}
          className="h-full"
        >
          {activeTab === "launchpad" && <LaunchpadView />}
        </View>

        {/* Community Panel */}
        <div
          role="tabpanel"
          id="community-panel"
          aria-labelledby="community-tab"
          hidden={activeTab !== "community"}
          className="h-full"
        >
          {activeTab === "community" && <CommunityTab />}
        </View>
      </View>
    </View>
  );
}