import { View, Text } from 'react-native';
import { useState } from "react";
import { motion, AnimatePresence } from "react-native-reanimated";
import { Shield, Check, AlertCircle, Lock, Eye, Heart, Scale, ChevronRight } from "lucide-react-native";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface GDPRConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function GDPRConsent({ onAccept, onDecline }: GDPRConsentProps) {
  const [step, setStep] = useState(0);
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false);
  const [hasReadEthics, setHasReadEthics] = useState(false);
  const [understandsConsent, setUnderstandsConsent] = useState(false);

  const totalSteps = 6;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    if (step === totalSteps - 1) {
      return hasReadPrivacy && hasReadEthics && understandsConsent;
    }
    return true;
  };

  return (
    <View className="h-full flex flex-col bg-[#FFFBF5] px-6 pt-6">
      {/* Content */}
      <View className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <Animated.View
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex flex-col justify-center max-w-md mx-auto"
            >
              <View className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#6B5CAC]/20 to-[#FF85A2]/20 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-[#2A0098]" strokeWidth={2} />
              </View>
              
              <Text className="text-[#2A0098] text-center mb-3">Your Privacy & Data Rights</Text>
              <Text className="text-[#6B5CAC] text-center mb-8">
                Before you begin, let's talk about how Coda protects your privacy and what you need to know about using assistive technology responsibly.
              </Text>

              <View className="bg-white/40 backdrop-blur-sm rounded-3xl p-6 border border-white/60 mb-6">
                <Text className="text-[#2A0098] leading-relaxed">
                  This will take about <strong>2 minutes to read</strong>. We've broken it into bite-sized sections so you understand exactly how Coda works and your responsibilities when using it.
                </Text>
              </View>

              {/* Quick Skip for Demo/Investors */}
              <button
                onPress={onAccept}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#10B981] to-[#34D399] text-white shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] flex items-center justify-center gap-2"
              >
                <span>⚡ Skip for Demo</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Step 1: How It Works */}
          {step === 1 && (
            <Animated.View
              key="how-it-works"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto py-8"
            >
              <View className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#10B981]/20 to-[#34D399]/20 flex items-center justify-center mx-auto mb-4">
                <Eye className="w-7 h-7 text-[#10B981]" strokeWidth={2} />
              </View>

              <Text className="text-[#2A0098] text-center mb-3">How Coda Works</Text>
              <Text className="text-[#6B5CAC] text-center mb-6">
                Understanding the technology
              </Text>

              <View className="space-y-4">
                <View className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-white/60">
                  <Text className="text-[#2A0098] mb-2">What is Coda?</Text>
                  <Text className="text-[#2A0098] text-sm leading-relaxed">
                    Coda is assistive technology designed to make conversations and lectures accessible for Deaf and hard-of-hearing students through real-time transcription and speaker identification.
                  </Text>
                </View>

                <View className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-white/60">
                  <Text className="text-[#2A0098] mb-2">Voice Processing</Text>
                  <Text className="text-[#2A0098] text-sm leading-relaxed">
                    When you calibrate someone's voice (e.g., "Alex"), Coda creates a mathematical signature, not a recording. This helps identify who's speaking in future conversations.
                  </Text>
                </View>

                <View className="bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-white/60">
                  <Text className="text-[#2A0098] mb-2">Real-Time Transcription</Text>
                  <Text className="text-[#2A0098] text-sm leading-relaxed">
                    Audio is converted to text instantly using on-device AI. The audio stream is processed in temporary memory only, but again, no recordings are made or stored.
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}

          {/* Step 2: Your Privacy */}
          {step === 2 && (
            <Animated.View
              key="privacy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto py-8"
            >
              <View className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6B5CAC]/20 to-[#8B7BC8]/20 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-[#6B5CAC]" strokeWidth={2} />
              </View>

              <Text className="text-[#2A0098] text-center mb-3">Your Privacy, Your Control</Text>
              <Text className="text-[#6B5CAC] text-center mb-6">
                Everything stays on your device
              </Text>

              <View className="space-y-3">
                <View className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/60 flex gap-3">
                  <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <div>
                    <Text className="text-[#2A0098]">
                      <strong>All processing happens locally</strong> on your phone using on-device AI
                    </Text>
                  </View>
                </View>

                <View className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/60 flex gap-3">
                  <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <div>
                    <Text className="text-[#2A0098]">
                      <strong>Voice profiles stay on your device</strong> and never leave your phone
                    </Text>
                  </View>
                </View>

                <View className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/60 flex gap-3">
                  <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <div>
                    <Text className="text-[#2A0098]">
                      <strong>No audio is uploaded or stored</strong>—only text transcriptions you choose to save
                    </Text>
                  </View>
                </View>

                <View className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/60 flex gap-3">
                  <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <div>
                    <Text className="text-[#2A0098]">
                      <strong>You control all data</strong>—delete voice profiles and transcripts anytime
                    </Text>
                  </View>
                </View>

                <View className="bg-gradient-to-br from-[#6B5CAC]/10 to-[#FF85A2]/10 rounded-2xl p-4 border border-[#6B5CAC]/30 mt-4">
                  <Text className="text-[#2A0098] text-sm">
                    <strong>We don't save your data on the cloud, or on servers. We will NEVER collect your data </strong> Everything happens on your device for your accessibility needs.
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}

          {/* Step 3: Ethical Use */}
          {step === 3 && (
            <Animated.View
              key="ethics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto py-8"
            >
              <View className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF85A2]/20 to-[#FFB3C6]/20 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-7 h-7 text-[#FF85A2]" strokeWidth={2} />
              </View>

              <Text className="text-[#2A0098] text-center mb-3">Your Responsibility</Text>
              <Text className="text-[#6B5CAC] text-center mb-6">
                Using Coda ethically and respectfully
              </Text>

              <View className="bg-[#FF85A2]/10 border border-[#FF85A2]/30 rounded-2xl p-5 mb-6">
                <View className="flex items-start gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-[#FF85A2] flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <Text className="text-[#2A0098] text-[15px]">
                    <strong>You must inform others that you're using live transcription before starting a session.</strong>
                  </Text>
                </View>
              </View>

              <View className="space-y-4">
                <View className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
                  <Text className="text-[#2A0098] mb-2 text-sm font-bold">Tell people upfront</Text>
                  <Text className="text-[#2A0098] text-sm">
                    A simple "I'm using a transcription app for accessibility" is enough. This respects others' privacy rights.
                  </Text>
                </View>

                <View className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
                  <Text className="text-[#2A0098] mb-2 text-sm font-bold">Respect boundaries</Text>
                  <Text className="text-[#2A0098] text-sm">
                    If someone is uncomfortable, respect their wishes. Use Coda in appropriate settings where participants are informed.
                  </Text>
                </View>

                <View className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
                  <Text className="text-[#2A0098] mb-2 text-sm font-bold">Secure your device</Text>
                  <Text className="text-[#2A0098] text-sm">
                    Since data is stored locally, keep your phone secure with a passcode or biometric lock.
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}

          {/* Step 4: Your Rights */}
          {step === 4 && (
            <Animated.View
              key="rights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto py-8"
            >
              <View className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F59E0B]/20 to-[#FBBF24]/20 flex items-center justify-center mx-auto mb-4">
                <Scale className="w-7 h-7 text-[#F59E0B]" strokeWidth={2} />
              </View>

              <Text className="text-[#2A0098] text-center mb-3">Your Data Rights</Text>
              <Text className="text-[#6B5CAC] text-center mb-6">
                What you can do with your data
              </Text>

              <View className="space-y-3">
                <View className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
                  <View className="flex items-start gap-3">
                    <View className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-[#10B981]" strokeWidth={2.5} />
                    </View>
                    <div>
                      <Text className="text-[#2A0098] mb-1">Access</Text>
                      <Text className="text-[#6B5CAC] text-sm">View all data stored by Coda in Settings → My Data</Text>
                    </View>
                  </View>
                </View>

                <View className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
                  <View className="flex items-start gap-3">
                    <View className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-[#10B981]" strokeWidth={2.5} />
                    </View>
                    <div>
                      <Text className="text-[#2A0098] mb-1">Export</Text>
                      <Text className="text-[#6B5CAC] text-sm">Download your data anytime</Text>
                    </View>
                  </View>
                </View>

                <View className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
                  <View className="flex items-start gap-3">
                    <View className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-[#10B981]" strokeWidth={2.5} />
                    </View>
                    <div>
                      <Text className="text-[#2A0098] mb-1">Delete</Text>
                      <Text className="text-[#6B5CAC] text-sm">Permanently erase voice profiles and transcripts</Text>
                    </View>
                  </View>
                </View>

                <View className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
                  <View className="flex items-start gap-3">
                    <View className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-[#10B981]" strokeWidth={2.5} />
                    </View>
                    <div>
                      <Text className="text-[#2A0098] mb-1">Stop Using</Text>
                      <Text className="text-[#6B5CAC] text-sm">Uninstall Coda anytime—it's your choice</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View className="bg-[#6B5CAC]/10 rounded-2xl p-4 border border-[#6B5CAC]/30 mt-6">
                <Text className="text-[#2A0098] text-sm">
                  <strong>Legal basis:</strong> Coda processes voice data under GDPR Article 6(1)(f) (legitimate interests) and Article 9(2)(g) (substantial public interest for disability accessibility).
                </Text>
              </View>
            </Animated.View>
          )}

          {/* Step 5: Final Confirmation */}
          {step === 5 && (
            <Animated.View
              key="confirmation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto py-8"
            >
              <View className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6B5CAC]/20 to-[#FF85A2]/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-[#2A0098]" strokeWidth={2} />
              </View>

              <Text className="text-[#2A0098] text-center mb-3">Ready to Begin?</Text>
              <Text className="text-[#6B5CAC] text-center mb-6">
                Please confirm you understand how Coda works
              </Text>

              <View className="space-y-4 mb-8">
                <View className="flex items-start gap-3 bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
                  <Checkbox
                    id="privacy-confirm"
                    checked={hasReadPrivacy}
                    onCheckedChange={(checked) => setHasReadPrivacy(checked as boolean)}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor="privacy-confirm" 
                    className="text-[#2A0098] cursor-pointer leading-relaxed"
                  >
                    I understand how Coda processes voice data locally on my device
                  </Label>
                </View>

                <View className="flex items-start gap-3 bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
                  <Checkbox
                    id="ethics-confirm"
                    checked={hasReadEthics}
                    onCheckedChange={(checked) => setHasReadEthics(checked as boolean)}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor="ethics-confirm" 
                    className="text-[#2A0098] cursor-pointer leading-relaxed"
                  >
                    I will inform others when using live transcription for accessibility
                  </Label>
                </View>

                <View className="flex items-start gap-3 bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/60">
                  <Checkbox
                    id="consent-confirm"
                    checked={understandsConsent}
                    onCheckedChange={(checked) => setUnderstandsConsent(checked as boolean)}
                    className="mt-1"
                  />
                  <Label 
                    htmlFor="consent-confirm" 
                    className="text-[#2A0098] cursor-pointer leading-relaxed"
                  >
                    I consent to using Coda for accessibility and understand my data rights
                  </Label>
                </View>
              </View>

              <View className="bg-[#FF85A2]/10 rounded-2xl p-4 border border-[#FF85A2]/20">
                <Text className="text-[#2A0098] text-sm text-center">
                  <strong>Note:</strong> This is a prototype. A production app would include additional security measures and formal privacy policies.
                </Text>
              </View>
            </Animated.View>
          )}
        
      </View>

      {/* Navigation */}
      <View className="pb-8 pt-4">
        <View className="flex gap-3 max-w-md mx-auto justify-center">
          {step > 0 && (
            <button
              onPress={handleBack}
              className="px-6 py-4 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/80 text-[#6B5CAC] hover:bg-white/80 transition-all focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5]"
            >
              Back
            </TouchableOpacity>
          )}
          
          {step < totalSteps - 1 ? (
            <button
              onPress={handleNext}
              className="flex-1 py-4 rounded-3xl bg-gradient-to-r from-[#6B5CAC] to-[#8B7BC8] text-white shadow-lg hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] flex items-center justify-center gap-2"
            >
              Continue
              <ChevronRight className="w-5 h-5" strokeWidth={2} />
            </TouchableOpacity>
          ) : (
            <View className="flex-1 flex gap-3">
              <button
                onPress={onDecline}
                className="flex-1 py-4 rounded-3xl bg-white/60 backdrop-blur-sm border border-white/80 text-[#6B5CAC] hover:bg-white/80 transition-all focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5]"
              >
                Decline
              </TouchableOpacity>
              <button
                onPress={onAccept}
                disabled={!canProceed()}
                className="flex-1 py-4 px-4 rounded-3xl bg-gradient-to-r from-[#6B5CAC] to-[#8B7BC8] text-white text-center shadow-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5]"
              >
                Accept & Start
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
