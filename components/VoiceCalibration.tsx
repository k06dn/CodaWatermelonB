import { View, Text } from 'react-native';
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "react-native-reanimated";
import { Mic, Check, ArrowLeft, User, UserPlus } from "lucide-react-native";
import { toast } from "react-native-toast-message";

interface VoiceCalibrationProps {
  onClose?: () => void;
  onComplete?: (name: string) => void;
  onSave?: (name: string, audioBlob: Blob) => void;
  deafUserName?: string;
}

export function VoiceCalibration({ onClose, onComplete, onSave, deafUserName = "You" }: VoiceCalibrationProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [personName, setPersonName] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const recordButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (step === 1 && nameInputRef.current) {
      nameInputRef.current.focus();
    } else if (step === 2 && recordButtonRef.current && !hasRecorded) {
      recordButtonRef.current.focus();
    }
  }, [step, hasRecorded]);

  const handleNext = () => {
    if (step === 1 && personName.trim()) {
      setStep(2);
    }
  };

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
    toast.success(`Voice profile added for ${personName}`, {
      description: <Text style={{ color: '#2A0098' }}>They'll now be identified in your conversations</Text>,
    });
    
    const mockBlob = new Blob([], { type: 'audio/wav' });
    
    if (onSave) {
      onSave(personName, mockBlob);
    }
    if (onComplete) {
      onComplete(personName);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setIsRecording(false);
      setHasRecorded(false);
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <View className="h-full flex flex-col bg-[#FFFBF5]">
      {/* Header */}
      <View className="px-6 pt-6 pb-4 bg-white/60 backdrop-blur-xl border-b border-[#2A0098]/10">
        <View className="flex items-center gap-3 mb-3">
          <button
            onPress={handleBack}
            className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm border border-white/60 flex items-center justify-center hover:bg-white/80 transition-all focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5]"
            aria-label={step === 1 ? "Close and return to conversation" : "Back to name entry"}
          >
            <ArrowLeft className="w-5 h-5 text-[#2A0098]" strokeWidth={2} aria-hidden="true" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-[#2A0098]">Add Voice Profile</Text>
            <Text className="text-[#6B5CAC]">
              Step {step} of 2
            </Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 overflow-y-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Name Entry */}
          {step === 1 && (
            <Animated.View
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md mx-auto"
            >
              <View className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-lg p-6 space-y-6">
                {/* Header */}
                <View className="text-center space-y-2">
                  <Animated.View
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#FF85A2]/20 to-[#FFB3C6]/30 flex items-center justify-center mb-4"
                    aria-hidden="true"
                  >
                    <UserPlus className="w-8 h-8 text-[#FF85A2]" strokeWidth={2} />
                  </Animated.View>
                  <Text className="text-[#2A0098]">Who are you adding?</Text>
                  <Text className="text-[#6B5CAC]">
                    Enter their name, then record their voice
                  </Text>
                </View>

                {/* Explanation */}
                <View className="bg-gradient-to-br from-[#D8FDCC]/30 to-[#D8FDCC]/10 backdrop-blur-sm rounded-2xl p-4 border border-[#D8FDCC]/50">
                  <Text className="text-[#6B5CAC] text-sm text-center leading-relaxed">
                    Once added, their name will appear next to their words in live transcriptions, making group conversations easier to follow.
                  </Text>
                </View>

                {/* Name Input */}
                <View className="space-y-2">
                  <label htmlFor="speaker-name" className="text-[#2A0098] block">
                    Their name
                  </label>
                  <input
                    ref={nameInputRef}
                    id="speaker-name"
                    type="text"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && personName.trim()) {
                        handleNext();
                      }
                    }}
                    placeholder="e.g., Alex, Dr. Smith, Mum..."
                    className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border-2 border-white/60 text-[#2A0098] placeholder:text-[#6B5CAC]/50 focus:outline-none focus:ring-2 focus:ring-[#FF85A2] focus:border-[#FF85A2] transition-all"
                    aria-describedby="name-description"
                    aria-required="true"
                  />
                  <Text id="name-description" className="text-[#6B5CAC] text-xs">
                    This is how they'll appear in your transcripts
                  </Text>
                </View>

                {/* Next Button */}
                <button
                  onPress={handleNext}
                  disabled={!personName.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF85A2] to-[#FFB3C6] text-white shadow-md hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#FF85A2] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                  aria-label="Continue to voice recording"
                  aria-disabled={!personName.trim()}
                >
                  Next
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* Step 2: Voice Recording */}
          {step === 2 && (
            <Animated.View
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md mx-auto"
            >
              <View className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-lg p-6 space-y-6">
                {/* Personalised Header */}
                <View className="text-center space-y-1">
                  <Text className="text-[#2A0098]">Record {personName}'s voice</Text>
                  <Text className="text-[#6B5CAC]">
                    Ask them to speak when ready
                  </Text>
                </View>

                {/* Instructions Card */}
                <View className="bg-gradient-to-br from-[#FFB3C6]/20 to-[#FF85A2]/10 backdrop-blur-sm rounded-2xl p-5 border border-[#FF85A2]/30">
                  <Text className="text-[#2A0098] text-sm text-center leading-relaxed">
                    <strong>{personName}</strong> should tap and hold the microphone below, then speak for a few seconds. Try: "Hello, this is my voice"
                  </Text>
                </View>

                {/* Recording Instructions */}
                <View className="text-center">
                  <Text 
                    className="text-[#2A0098] mb-8"
                    id="recording-instructions"
                    role="status"
                    aria-live="polite"
                  >
                    {hasRecorded
                      ? `✓ ${personName}'s voice has been captured`
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

                    {/* Main Microphone Button */}
                    <Animated.View
                      ref={recordButtonRef}
                      onMouseDown={handleRecordStart}
                      onMouseUp={handleRecordEnd}
                      onTouchStart={handleRecordStart}
                      onTouchEnd={handleRecordEnd}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          if (!hasRecorded) handleRecordStart();
                        }
                      }}
                      onKeyUp={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
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
                          ? `${personName}'s voice sample successfully recorded`
                          : isRecording
                          ? `Recording ${personName}'s voice sample, release to stop`
                          : `Press and hold to record ${personName}'s voice sample`
                      }
                      aria-pressed={isRecording}
                      aria-disabled={hasRecorded}
                      aria-describedby="recording-instructions"
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
                        : "They should speak clearly for 3-5 seconds"}
                    </Text>
                  )}
                </View>

                {/* Completion Info */}
                {hasRecorded && (
                  <Animated.View
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#10B981]/20 to-[#D8FDCC]/30 backdrop-blur-sm rounded-2xl p-4 border border-[#10B981]/30"
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
                          Coda will now show "{personName}" when this voice is detected in conversations
                        </Text>
                      </View>
                    </View>
                  </Animated.View>
                )}

                {/* Complete Button */}
                {hasRecorded && (
                  <Animated.View
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onPress={handleComplete}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#34D399] text-white shadow-md hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] transition-all active:scale-[0.98] flex items-center justify-center"
                    aria-label="Complete voice profile and return to conversation"
                  >
                    Done
                  </Animated.View>
                )}
              </View>
            </Animated.View>
          )}
        
      </View>
    </View>
  );
}
