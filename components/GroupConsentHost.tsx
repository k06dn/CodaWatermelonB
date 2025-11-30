import { View, Text } from 'react-native';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "react-native-reanimated";
import { Users, Shield, Clock, Trash2, Share2, CheckCircle2, Circle } from "lucide-react-native";
import { toast } from "react-native-toast-message";

interface Participant {
  id: string;
  name: string;
  hasConsented: boolean;
  joinedAt: Date;
}

interface GroupConsentHostProps {
  onStartRecording: (participants: Participant[]) => void;
  onCancel: () => void;
  hostName: string;
}

export function GroupConsentHost({ onStartRecording, onCancel, hostName }: GroupConsentHostProps) {
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 9));
  const [participants, setParticipants] = useState<Participant[]>([
    { id: "host", name: hostName || "You", hasConsented: true, joinedAt: new Date() }
  ]);
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    // Generate shareable link (for demo purposes - in production this would be a real URL)
    const link = `${// window - removed for RN //location.origin}/join/${sessionId}`;
    setShareLink(link);
  }, [sessionId]);

  const allConsented = participants.length > 1 && participants.every(p => p.hasConsented);
  const waitingCount = participants.filter(p => !p.hasConsented).length;

  const handleStartRecording = () => {
    if (!allConsented) {
      toast.error("All participants must consent before starting");
      return;
    }
    onStartRecording(participants);
  };

  const handleRemoveParticipant = (id: string) => {
    if (id === "host") return;
    setParticipants(prev => prev.filter(p => p.id !== id));
    toast.success("Participant removed");
  };

  const handleCopyLink = async () => {
    try {
      // Try modern clipboard API first
      await navigator.clipboard.writeText(shareLink);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      // Fallback for when clipboard API is blocked
      try {
        // Create temporary textarea
        const textarea = document.createElement('textarea');
        textarea.value = shareLink;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        toast.success("Link copied to clipboard!");
      } catch (fallbackErr) {
        // If both methods fail, show the link for manual copying
        toast.info("Copy this link manually", {
          description: shareLink,
          duration: 5000
        });
      }
    }
  };

  // Simulate participant joining (for demo - in production this would come from real-time updates)
  const simulateParticipantJoin = () => {
    const demoNames = ["Emma", "Tom", "Alex", "Sarah", "James"];
    const availableNames = demoNames.filter(name => !participants.some(p => p.name === name));
    if (availableNames.length === 0) return;

    const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
    const newParticipant: Participant = {
      id: Math.random().toString(36).substring(2, 9),
      name: randomName,
      hasConsented: Math.random() > 0.3, // 70% chance of auto-consent for demo
      joinedAt: new Date()
    };
    setParticipants(prev => [...prev, newParticipant]);
    toast.success(`${randomName} has joined!`);
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
          <Text className="text-[#2A0098] mb-1">Start Group Conversation</Text>
          <Text className="text-[#6B5CAC] text-sm">Privacy-first recording with group consent</Text>
        </Animated.View>
      </View>

      {/* Content */}
      <View className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">
        {/* Privacy Information Card */}
        <Animated.View
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-lg p-5 space-y-3"
        >
          <View className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-[#2A0098]" strokeWidth={2} />
            <Text className="text-[#2A0098]">Before Recording</Text>
          </View>
          
          <View className="space-y-2.5">
            <View className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#6B5CAC] mt-0.5 flex-shrink-0" strokeWidth={2} />
              <Text className="text-[#2A0098] text-sm">All participants must give explicit consent</Text>
            </View>
            <View className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#6B5CAC] mt-0.5 flex-shrink-0" strokeWidth={2} />
              <Text className="text-[#2A0098] text-sm">Transcription visible only to this group</Text>
            </View>
            <View className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#6B5CAC] mt-0.5 flex-shrink-0" strokeWidth={2} />
              <Text className="text-[#2A0098] text-sm">Data stored locally on your device</Text>
            </View>
            <View className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#6B5CAC] mt-0.5 flex-shrink-0" strokeWidth={2} />
              <Text className="text-[#2A0098] text-sm">Auto-deleted after 30 days</Text>
            </View>
            <View className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#6B5CAC] mt-0.5 flex-shrink-0" strokeWidth={2} />
              <Text className="text-[#2A0098] text-sm">Anyone can leave and withdraw consent anytime</Text>
            </View>
          </View>
        </Animated.View>

        {/* Share Session Card */}
        <Animated.View
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-lg p-5"
        >
          <View className="flex items-center gap-2 mb-3">
            <Share2 className="w-5 h-5 text-[#2A0098]" strokeWidth={2} />
            <Text className="text-[#2A0098]">Invite Participants</Text>
          </View>
          
          <View className="bg-white/50 rounded-xl p-4 mb-4 border border-white/60">
            <Text className="text-[#6B5CAC] text-xs mb-3">Session Link</Text>
            <View className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <code className="flex-1 text-xs text-[#2A0098] bg-white/80 rounded-lg px-3 py-3 border border-white/60 overflow-x-auto break-all">
                {shareLink}
              </code>
              <button
                onPress={handleCopyLink}
                className="px-5 py-3 rounded-lg bg-gradient-to-br from-[#6B5CAC] to-[#8B7BC8] text-white hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] min-h-[44px] whitespace-nowrap"
                aria-label="Copy link"
              >
                Copy Link
              </TouchableOpacity>
            </View>
          </View>

          {/* Demo button for adding participants */}
          <button
            onPress={simulateParticipantJoin}
            className="mx-auto block px-6 py-2.5 rounded-xl bg-[#6B5CAC]/10 hover:bg-[#6B5CAC]/20 text-[#6B5CAC] text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] min-h-[44px]"
          >
            + Simulate Participant Join (Demo)
          </TouchableOpacity>
        </Animated.View>

        {/* Participants Waiting Room */}
        <Animated.View
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-lg p-5"
        >
          <View className="flex items-center justify-between mb-4">
            <View className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#2A0098]" strokeWidth={2} />
              <Text className="text-[#2A0098]">Participants</Text>
            </View>
            <View className="px-3 py-1 rounded-full bg-[#EC4899]/10 border border-[#EC4899]/20">
              <Text className="text-[#EC4899] text-sm">{participants.length} joined</Text>
            </View>
          </View>

          {waitingCount > 0 && (
            <View className="mb-4 p-3 rounded-xl bg-[#FF85A2]/10 border border-[#FF85A2]/20">
              <View className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FF85A2]" strokeWidth={2} />
                <Text className="text-[#FF85A2] text-sm">
                  Waiting for {waitingCount} {waitingCount === 1 ? "person" : "people"} to consent
                </Text>
              </View>
            </View>
          )}

          <View className="space-y-2">
            <AnimatePresence mode="popLayout">
              {participants.map((participant) => (
                <Animated.View
                  key={participant.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-white/60"
                >
                  <View className="flex-shrink-0">
                    {participant.hasConsented ? (
                      <View className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10b981] to-[#34d399] flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2} />
                      </View>
                    ) : (
                      <View className="w-10 h-10 rounded-full bg-[#6B5CAC]/20 flex items-center justify-center">
                        <Circle className="w-5 h-5 text-[#6B5CAC]" strokeWidth={2} />
                      </View>
                    )}
                  </View>
                  
                  <View className="flex-1 min-w-0">
                    <Text className="text-[#2A0098]">
                      {participant.name}
                      {participant.id === "host" && " (Host)"}
                    </Text>
                    <Text className="text-[#6B5CAC] text-xs">
                      {participant.hasConsented ? "✓ Consented" : "Waiting for consent..."}
                    </Text>
                  </View>

                  {participant.id !== "host" && (
                    <button
                      onPress={() => handleRemoveParticipant(participant.id)}
                      className="p-2 rounded-lg hover:bg-white/80 text-[#6B5CAC] hover:text-[#FF85A2] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF85A2]"
                      aria-label={`Remove ${participant.name}`}
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={2} />
                    </TouchableOpacity>
                  )}
                </Animated.View>
              ))}
            
          </View>
        </Animated.View>
      </View>

      {/* Footer Actions */}
      <View className="px-6 pb-6 pt-4 border-t border-white/50 bg-white/40 backdrop-blur-xl">
        <View className="max-w-md mx-auto space-y-3">
          <button
            onPress={handleStartRecording}
            disabled={!allConsented}
            className={`w-full py-4 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#EC4899] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] min-h-[56px] flex items-center justify-center ${
              allConsented
                ? "bg-gradient-to-br from-[#EC4899] to-[#F472B6] text-white shadow-lg hover:shadow-xl"
                : "bg-[#6B5CAC]/20 text-[#6B5CAC]/50 cursor-not-allowed"
            }`}
          >
            {allConsented ? "🎙️ Start Recording" : `⏳ Waiting for ${waitingCount} consent${waitingCount !== 1 ? "s" : ""}`}
          </TouchableOpacity>

          <button
            onPress={onCancel}
            className="w-full py-3 rounded-xl bg-white/60 hover:bg-white/80 text-[#6B5CAC] border border-white/80 transition-all focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] min-h-[44px]"
          >
            Cancel Session
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
