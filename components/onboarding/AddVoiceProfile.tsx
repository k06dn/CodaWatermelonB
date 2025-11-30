import { View, Text } from 'react-native';
import { useState, useRef, useEffect } from "react";
import { motion } from "react-native-reanimated";
import { Mic, Check, ArrowLeft } from "lucide-react-native";

interface AddVoiceProfileProps {
  onComplete: () => void;
  onBack: () => void;
  ownerName: string;
}

export function AddVoiceProfile({ onComplete, onBack, ownerName }: AddVoiceProfileProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const recordButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (recordButtonRef.current && !hasRecorded) {
      recordButtonRef.current.focus();
    }
  }, [hasRecorded]);

  const handleRecordStart = () => {
    setIsRecording(true);
  };

  const handleRecordEnd = () => {
    setIsRecording(false);
    setTimeout(() => {
      setHasRecorded(true);
    }, 300);
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <View className="w-full max-w-md mx-auto">
      {/* Back button */}
      <View className="mb-6">
        <button
          onPress={onBack}
          className="inline-flex items-center gap-2 text-[#6B5CAC] hover:text-[#2A0098] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] rounded-lg p-2 -ml-2"
          aria-label="Back to voice setup explanation"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
          <Text className="text-sm">Back</Text>
        </TouchableOpacity>
      </View>

      {/* Recording Card */}
      <Animated.View
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <View className="text-center">
          <Text className="text-[#2A0098] mb-2">Record your voice</Text>
          <Text className="text-[#6B5CAC]">
            This will only take a moment
          </Text>
        </View>

        <View className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/80 shadow-lg p-8 space-y-6">
          {/* Instructions */}
          <View className="bg-gradient-to-br from-[#D8FDCC]/30 to-[#D8FDCC]/10 backdrop-blur-sm rounded-xl p-4 border border-[#D8FDCC]/50">
            <Text className="text-[#2A0098] text-sm text-center leading-relaxed">
              Tap and hold the microphone, then say something like: <strong>"Hello, this is {ownerName}"</strong>
            </Text>
          </View>

          {/* Recording Status */}
          <View className="text-center">
            <p
              className="text-[#2A0098] mb-8"
              id="recording-status"
              role="status"
              aria-live="polite"
            >
              {hasRecorded
                ? "✓ Your voice has been captured"
                : "Tap and hold the microphone to record"}
            </Text>

            {/* Microphone Button */}
            <View className="relative w-32 h-32 mb-4 flex items-center justify-center mx-auto">
              {/* Animated soundwave rings */}
              {isRecording && (
                <>
                  {[1, 2, 3].map((i) => (
                    <Animated.View
                      key={i}
                      className="absolute rounded-full border-2 border-[#FF85A2]"
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{
                        scale: [1, 1.8, 2.5],
                        opacity: [0.6, 0.3, 0],
                      }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeOut",
                      }}
                      style={{
                        width: "128px",
                        height: "128px",
                        left: "50%",
                        top: "50%",
                        marginLeft: "-64px",
                        marginTop: "-64px",
                      }}
                      aria-hidden="true"
                    />
                  ))}
                </>
              )}

              {/* Main Button */}
              <Animated.View
                ref={recordButtonRef}
                onMouseDown={handleRecordStart}
                onMouseUp={handleRecordEnd}
                onTouchStart={handleRecordStart}
                onTouchEnd={handleRecordEnd}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    if (!hasRecorded) handleRecordStart();
                  }
                }}
                onKeyUp={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    if (!hasRecorded) handleRecordEnd();
                  }
                }}
                disabled={hasRecorded}
                className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-4 focus:ring-[#FF85A2]/50 ${
                  hasRecorded
                    ? "bg-gradient-to-br from-[#10B981] to-[#34D399] cursor-default shadow-xl"
                    : isRecording
                    ? "bg-gradient-to-br from-[#FF85A2] to-[#FFB3C6] scale-110 shadow-2xl"
                    : "bg-gradient-to-br from-[#FF85A2] to-[#FFB3C6] hover:scale-105 shadow-xl active:scale-95"
                }`}
                whileTap={!hasRecorded ? { scale: 0.95 } : {}}
                aria-label={
                  hasRecorded
                    ? "Your voice sample successfully recorded"
                    : isRecording
                    ? "Recording your voice sample, release to stop"
                    : "Press and hold to record your voice sample"
                }
                aria-pressed={isRecording}
                aria-disabled={hasRecorded}
                aria-describedby="recording-status"
              >
                {hasRecorded ? (
                  <Animated.View
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <Check className="w-16 h-16 text-white" strokeWidth={3} aria-hidden="true" />
                  </Animated.View>
                ) : (
                  <Mic
                    className={`w-14 h-14 text-white transition-transform ${
                      isRecording ? "scale-110" : ""
                    }`}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                )}
              </Animated.View>
            </View>

            {/* Recording hint */}
            {!hasRecorded && (
              <Text className="text-[#6B5CAC] text-xs" role="status" aria-live="polite">
                {isRecording
                  ? "Listening... keep speaking"
                  : "Speak for 3-5 seconds"}
              </Text>
            )}
          </View>

          {/* Success Message */}
          {hasRecorded && (
            <Animated.View
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#10B981]/20 to-[#D8FDCC]/30 backdrop-blur-sm rounded-xl p-4 border border-[#10B981]/30"
              role="status"
              aria-live="polite"
            >
              <View className="flex items-start gap-3">
                <View className="w-6 h-6 rounded-lg bg-[#10B981]/30 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <Check className="w-4 h-4 text-[#10B981]" strokeWidth={2.5} />
                </View>
                <View className="flex-1">
                  <Text className="text-[#2A0098] mb-0.5 text-sm" style={{ fontWeight: 600 }}>
                    Voice profile created!
                  </Text>
                  <Text className="text-[#6B5CAC] text-xs leading-relaxed">
                    Coda will now show "You" when your voice is detected in conversations
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}

          {/* Complete Button */}
          {hasRecorded && (
            <View className="flex justify-center">
              <Animated.View
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onPress={handleComplete}
                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#34D399] text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:ring-offset-2 focus:ring-offset-[#FFFBF5]"
                aria-label="Complete voice profile setup and continue"
              >
                Continue
              </Animated.View>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
}
