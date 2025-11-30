import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from "react";
import { Mic, Users, Bell, MessageSquare, BookOpen, Map } from "lucide-react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { EnvironmentRadar } from "./EnvironmentRadar";
import { TalkView } from "./TalkView";
import { SensoryScoutView } from "./SensoryScoutView";
import { StudyView } from "./StudyView";
import { AlertsView } from "./AlertsView";

type ViewType = "aware" | "conversation" | "scout" | "study" | "alerts";

interface AwareScreenProps {
  userName?: string;
  onOpenSettings?: () => void;
  onViewChange?: (view: ViewType) => void;
}

export function AwareScreen({ userName = "there", onOpenSettings, onViewChange }: AwareScreenProps) {
  const [currentView, setCurrentView] = useState<ViewType>("aware");

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    onViewChange?.(view);
  };

  const navItems = [
    { id: "aware" as ViewType, icon: Mic, label: "Aware", activeColor: "#6B5CAC" },
    { id: "conversation" as ViewType, icon: MessageSquare, label: "Talk", activeColor: "#FF85A2" },
    { id: "scout" as ViewType, icon: Map, label: "Scout", activeColor: "#10B981" },
    { id: "study" as ViewType, icon: BookOpen, label: "Study", activeColor: "#F59E0B" },
    { id: "alerts" as ViewType, icon: Bell, label: "Alerts", activeColor: "#3B82F6" },
  ];

  return (
    <View className="h-full bg-[#FFFBF5] relative overflow-hidden">
      {/* Decorative background blobs */}
      <View className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <View className="absolute top-20 -left-20 w-80 h-80 bg-[#10B981]/15 rounded-full blur-3xl"></View>
        <View className="absolute bottom-32 -right-20 w-80 h-80 bg-[#FFB3C6]/20 rounded-full blur-3xl"></View>
        <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6B5CAC]/10 rounded-full blur-3xl"></View>
      </View>

      {/* Main content area */}
      <View className="relative h-full pb-28">
        {currentView === "aware" && (
          <Animated.View entering={FadeIn} exiting={FadeOut} className="h-full">
            <EnvironmentRadar userName={userName} />
          </Animated.View>
        )}
        {currentView === "conversation" && (
          <Animated.View entering={FadeIn} exiting={FadeOut} className="h-full">
            <TalkView userName={userName} />
          </Animated.View>
        )}
        {currentView === "scout" && (
          <Animated.View entering={FadeIn} exiting={FadeOut} className="h-full">
            <SensoryScoutView />
          </Animated.View>
        )}
        {currentView === "study" && (
          <Animated.View entering={FadeIn} exiting={FadeOut} className="h-full">
            <StudyView />
          </Animated.View>
        )}
        {currentView === "alerts" && (
          <Animated.View entering={FadeIn} exiting={FadeOut} className="h-full">
            <AlertsView />
          </Animated.View>
        )}
      </View>

      {/* Bottom navigation - glassmorphic */}
      <View className="absolute bottom-0 left-0 right-0 bg-white/60 backdrop-blur-xl border-t border-[#2A0098]/10">
        <View className="flex flex-row px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleViewChange(item.id)}
                className="flex-1 flex-col items-center gap-1.5 py-2 rounded-xl"
                accessibilityLabel={`${item.label} tab${isActive ? ', currently selected' : ''}`}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                <View
                  className={`p-2.5 rounded-full ${isActive ? 'shadow-lg' : 'bg-white/50'}`}
                  style={isActive ? { backgroundColor: item.activeColor } : undefined}
                >
                  <Icon color={isActive ? 'white' : '#6B5CAC'} size={20} strokeWidth={2.5} />
                </View>
                <Text className={`text-xs ${isActive ? 'text-[#2A0098]' : 'text-[#6B5CAC]'}`}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}