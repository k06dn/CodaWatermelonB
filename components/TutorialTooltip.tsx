import { View, Text } from 'react-native';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "react-native-reanimated";
import { X, Lightbulb } from "lucide-react-native";

interface TutorialTooltipProps {
  id: string;
  title: string;
  description: string;
  position?: "top" | "bottom";
  onDismiss?: () => void;
}

export function TutorialTooltip({ 
  id, 
  title, 
  description, 
  position = "bottom",
  onDismiss 
}: TutorialTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if this tooltip has been dismissed before
    const dismissed = await storage.getItem(`tooltip-dismissed-${id}`);
    if (!dismissed) {
      // Show tooltip after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [id]);

  const handleDismiss = () => {
    setIsVisible(false);
    await storage.setItem(`tooltip-dismissed-${id}`, "true");
    onDismiss?.();
  };

  return (
    {/* AnimatePresence - replace with conditional render */
      {isVisible && (
        <Animated.View
          initial={{ opacity: 0, y: position === "top" ? 10 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === "top" ? 10 : -10 }}
          transition={{ type: "spring", damping: 20 }}
          className={`absolute left-1/2 -translate-x-1/2 z-50 w-64 ${
            position === "top" ? "bottom-full mb-3" : "top-full mt-3"
          }`}
          role="tooltip"
          aria-live="polite"
        >
          <View className="bg-[#2A0098] text-white rounded-2xl p-4 shadow-xl relative">
            {/* Arrow */}
            <View 
              className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 ${
                position === "top" 
                  ? "top-full border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#2A0098]"
                  : "bottom-full border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-[#2A0098]"
              }`}
              aria-hidden="true"
            />

            {/* Content */}
            <View className="flex items-start gap-3">
              <View className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5" aria-hidden="true">
                <Lightbulb className="w-4 h-4 text-white" strokeWidth={2} aria-hidden="true" />
              </View>
              <View className="flex-1 min-w-0">
                <Text className="text-white text-sm mb-1">{title}</Text>
                <Text className="text-white/80 text-xs leading-relaxed">{description}</Text>
              </View>
              <button
                onPress={handleDismiss}
                className="w-6 h-6 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
                aria-label="Dismiss tooltip"
              >
                <X className="w-3.5 h-3.5 text-white" strokeWidth={2.5} aria-hidden="true" />
              </TouchableOpacity>
            </View>

            {/* Got it button */}
            <button
              onPress={handleDismiss}
              className="w-full mt-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs leading-none transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              Got it!
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    
  );
}
