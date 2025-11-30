import { View, Text } from 'react-native';
import { useState } from "react";
import { motion } from "react-native-reanimated";
import { Users, AlertCircle, CheckCircle2 } from "lucide-react-native";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";

interface GroupConsentParticipantProps {
  onJoinSession: (name: string) => void;
  onDecline: () => void;
  hostName: string;
  sessionId: string;
}

export function GroupConsentParticipant({ 
  onJoinSession, 
  onDecline, 
  hostName,
  sessionId 
}: GroupConsentParticipantProps) {
  const [participantName, setParticipantName] = useState("");
  const [hasConsented, setHasConsented] = useState(false);

  const canJoin = participantName.trim().length >= 2 && hasConsented;

  const handleJoin = () => {
    if (!canJoin) return;
    onJoinSession(participantName.trim());
  };

  return (
    <View className="h-full flex flex-col bg-gradient-to-b from-[#FFFBF5] to-[#FFF8EF]">
      {/* Header */}
      <View className="px-6 pt-4 pb-3">
        <Animated.View
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <View className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#EC4899] to-[#F472B6] mb-3">
            <Users className="w-8 h-8 text-white" strokeWidth={2} />
          </View>
          <Text className="text-[#2A0098] mb-1">Join Conversation</Text>
          <Text className="text-[#6B5CAC] text-sm">You're invited by {hostName}</Text>
        </Animated.View>
      </View>

      {/* Content */}
      <View className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">
        {/* Session Info */}
        <Animated.View
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-lg p-5"
        >
          <View className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-[#FF85A2]" strokeWidth={2} />
            <Text className="text-[#2A0098]">You're Invited to a Recorded Conversation</Text>
          </View>
          
          <View className="bg-[#FF85A2]/5 rounded-xl p-4 border border-[#FF85A2]/20 mb-4">
            <Text className="text-[#2A0098] text-sm leading-relaxed">
              This conversation will be recorded and transcribed. Your consent is required before joining.
            </Text>
          </View>

          <View className="space-y-3">
            <View className="flex items-start gap-3">
              <View className="w-6 h-6 rounded-full bg-[#6B5CAC]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Text className="text-[#6B5CAC] text-xs">1</Text>
              </View>
              <div>
                <Text className="text-[#2A0098] text-sm">Your voice will be transcribed to text</Text>
                <Text className="text-[#6B5CAC] text-xs mt-0.5">Real-time speech-to-text during the conversation</Text>
              </View>
            </View>

            <View className="flex items-start gap-3">
              <View className="w-6 h-6 rounded-full bg-[#6B5CAC]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Text className="text-[#6B5CAC] text-xs">2</Text>
              </View>
              <div>
                <Text className="text-[#2A0098] text-sm">Only this group can see the transcript</Text>
                <Text className="text-[#6B5CAC] text-xs mt-0.5">Private to participants, not shared externally</Text>
              </View>
            </View>

            <View className="flex items-start gap-3">
              <View className="w-6 h-6 rounded-full bg-[#6B5CAC]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Text className="text-[#6B5CAC] text-xs">3</Text>
              </View>
              <div>
                <Text className="text-[#2A0098] text-sm">Stored locally, not on external servers</Text>
                <Text className="text-[#6B5CAC] text-xs mt-0.5">Data remains on participants' devices</Text>
              </View>
            </View>

            <View className="flex items-start gap-3">
              <View className="w-6 h-6 rounded-full bg-[#6B5CAC]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Text className="text-[#6B5CAC] text-xs">4</Text>
              </View>
              <div>
                <Text className="text-[#2A0098] text-sm">You can leave anytime</Text>
                <Text className="text-[#6B5CAC] text-xs mt-0.5">Withdraw consent during or after the session</Text>
              </View>
            </View>

            <View className="flex items-start gap-3">
              <View className="w-6 h-6 rounded-full bg-[#6B5CAC]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Text className="text-[#6B5CAC] text-xs">5</Text>
              </View>
              <div>
                <Text className="text-[#2A0098] text-sm">Auto-deleted after 30 days</Text>
                <Text className="text-[#6B5CAC] text-xs mt-0.5">Transcripts are not kept permanently</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Your Details */}
        <Animated.View
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-lg p-5"
        >
          <Text className="text-[#2A0098] mb-4">Your Details</Text>
          
          <View className="space-y-4">
            <div>
              <label htmlFor="participant-name" className="text-[#2A0098] text-sm mb-2 block">
                Your Name (visible to group)
              </label>
              <Input
                id="participant-name"
                type="text"
                placeholder="Enter your first name"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                className="bg-white/80 border-white/60 text-[#2A0098] placeholder:text-[#6B5CAC]/50 focus:ring-2 focus:ring-[#6B5CAC] focus:border-[#6B5CAC] min-h-[44px]"
                maxLength={50}
              />
              <Text className="text-[#6B5CAC] text-xs mt-1.5">
                This will appear next to your messages in the transcript
              </Text>
            </View>

            {/* Consent Checkbox */}
            <View className="pt-4 border-t border-white/50">
              <View className="flex items-start gap-3 p-3 rounded-xl bg-white/40 border border-white/60">
                <Checkbox
                  id="consent-check"
                  checked={hasConsented}
                  onCheckedChange={(checked) => setHasConsented(checked as boolean)}
                  className="mt-0.5 min-w-[22px] min-h-[22px] data-[state=checked]:bg-[#2A0098] data-[state=checked]:border-[#2A0098]"
                />
                <label
                  htmlFor="consent-check"
                  className="text-[#2A0098] text-sm leading-relaxed cursor-pointer select-none flex-1"
                >
                  I consent to this conversation being recorded and transcribed for our group's private use
                </label>
              </View>

              {hasConsented && (
                <Animated.View
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-[#10b981]/10 border border-[#10b981]/20"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] flex-shrink-0" strokeWidth={2} />
                  <Text className="text-[#10b981] text-sm">Consent confirmed</Text>
                </Animated.View>
              )}
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Footer Actions */}
      <View className="px-6 pb-6 pt-4 border-t border-white/50 bg-white/40 backdrop-blur-xl">
        <View className="max-w-md mx-auto space-y-3">
          <button
            onPress={handleJoin}
            disabled={!canJoin}
            className={`w-full py-4 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#EC4899] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] min-h-[56px] ${
              canJoin
                ? "bg-gradient-to-br from-[#EC4899] to-[#F472B6] text-white shadow-lg hover:shadow-xl"
                : "bg-[#6B5CAC]/20 text-[#6B5CAC]/50 cursor-not-allowed"
            }`}
          >
            {canJoin ? "✓ Join Session" : "Enter your name and consent to join"}
          </TouchableOpacity>

          <button
            onPress={onDecline}
            className="w-full py-3 rounded-xl bg-white/60 hover:bg-white/80 text-[#6B5CAC] border border-white/80 transition-all focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] min-h-[44px]"
          >
            Decline & Exit
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
