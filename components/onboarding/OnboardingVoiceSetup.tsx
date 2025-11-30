import { View, Text } from 'react-native';
import { motion } from "react-native-reanimated";
import { User, Check, Sparkles, ChevronRight } from "lucide-react-native";

interface OnboardingVoiceSetupProps {
  userName: string;
  onContinue: () => void;
  onSkip: () => void;
}

export function OnboardingVoiceSetup({ userName, onContinue, onSkip }: OnboardingVoiceSetupProps) {
  return (
    <View className="w-full max-w-md mx-auto px-2">
      {/* Header */}
      <View className="text-center mb-5">
        <Text className="text-[#2A0098] mb-2">Add your voice profile</Text>
        <Text className="text-[#6B5CAC]">
          So you can see when you're speaking
        </Text>
      </View>

      {/* Explanation Card */}
      <Animated.View
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-lg p-4 mb-4"
      >
        <View className="flex items-start gap-3">
          <View className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D8FDCC]/50 to-[#D8FDCC]/30 flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <Sparkles className="w-5 h-5 text-[#10B981]" strokeWidth={2} />
          </View>
          <View className="flex-1">
            <Text className="text-[#2A0098] mb-1">How it works</Text>
            <Text className="text-[#6B5CAC] text-sm leading-relaxed">
              Record a quick voice sample so Coda can identify when you're speaking in conversations. Later, you can add your friends and classmates too.
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Benefits List */}
      <Animated.View
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="bg-gradient-to-br from-[#D8FDCC]/30 to-[#D8FDCC]/10 backdrop-blur-sm rounded-2xl p-4 border border-[#D8FDCC]/50 mb-4"
      >
        <Text className="text-[#2A0098] mb-2.5" style={{ fontWeight: 600 }}>
          This helps you:
        </Text>
        <ul className="space-y-2" aria-label="Benefits of adding your voice">
          <li className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
            <Text className="text-[#6B5CAC] text-sm">See your own words clearly labelled in transcripts</Text>
          </li>
          <li className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
            <Text className="text-[#6B5CAC] text-sm">Know when you're speaking vs others in group chats</Text>
          </li>
          <li className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
            <Text className="text-[#6B5CAC] text-sm">Review conversations and see what you said</Text>
          </li>
        </ul>
      </Animated.View>

      {/* Info Note */}
      <Animated.View
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/60 mb-5"
      >
        <Text className="text-[#6B5CAC] text-xs text-center leading-relaxed">
          Takes about 10 seconds. You can add other people's voices later in the Talk settings.
        </Text>
      </Animated.View>

      {/* Buttons */}
      <View className="space-y-3 pb-2">
        <button
          onPress={onContinue}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF85A2] to-[#FFB3C6] text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#FF85A2] focus:ring-offset-2 focus:ring-offset-[#FFFBF5]"
        >
          <span>Add my voice</Text>
          <ChevronRight className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
        </TouchableOpacity>
        
        <button
          onPress={onSkip}
          className="block mx-auto px-8 py-2.5 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 text-[#6B5CAC] hover:bg-white/80 hover:text-[#2A0098] transition-all focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5]"
        >
          I'll do this later
        </TouchableOpacity>
      </View>
    </View>
  );
}
