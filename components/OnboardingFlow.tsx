import { View, Text } from 'react-native';
import { useState } from "react";
import { motion, AnimatePresence } from "react-native-reanimated";
import { ChevronRight, Check, Mic, Bell, Calendar, Radar, MessageCircle, Users, BookOpen } from "lucide-react-native";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { OnboardingStep } from "./onboarding/OnboardingStep";
import { OnboardingVoiceSetup } from "./onboarding/OnboardingVoiceSetup";
import { AddVoiceProfile } from "./onboarding/AddVoiceProfile";
import { GDPRConsent } from "./onboarding/GDPRConsent";

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  name: string;
  communicationMethods: string[];
  challenges: string[];
  permissionsGranted: boolean;
  voiceProfileAdded?: boolean;
  gdprConsent: boolean;
}

const communicationOptions = [
  { id: "bsl", label: "BSL (British Sign Language)" },
  { id: "lipreading", label: "Lip-reading" },
  { id: "hearingAids", label: "Hearing aids" },
  { id: "cochlearImplant", label: "Cochlear implant" },
  { id: "other", label: "Other methods" },
];

const challengeOptions = [
  { id: "discussions", label: "Following group discussions" },
  { id: "focusing", label: "Focusing during study" },
  { id: "navigation", label: "Navigating campus spaces" },
  { id: "time", label: "Managing time effectively" },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [communicationMethods, setCommunicationMethods] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<string[]>([]);
  const [voiceProfileAdded, setVoiceProfileAdded] = useState(false);
  const [voiceSubStep, setVoiceSubStep] = useState<"intro" | "adding">("intro");
  const [gdprConsent, setGdprConsent] = useState(false);

  const totalSteps = 8;

  const handleCommunicationToggle = (id: string) => {
    setCommunicationMethods(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleChallengeToggle = (id: string) => {
    setChallenges(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      onComplete({
        name: name || "there",
        communicationMethods,
        challenges,
        permissionsGranted: true,
        voiceProfileAdded,
        gdprConsent,
      });
    }
  };

  const handleGDPRAccept = () => {
    setGdprConsent(true);
    handleNext();
  };

  const handleGDPRDecline = () => {
    // In a real app, this would exit the onboarding or show a message
    // For now, we'll just show an alert
    alert("You must accept the privacy terms to use Coda. The app requires your consent to process voice data for accessibility.");
  };

  const handleSkipVoice = () => {
    setStep(step + 1);
    setVoiceSubStep("intro");
  };

  const handleAddVoice = () => {
    setVoiceSubStep("adding");
  };

  const handleVoiceComplete = () => {
    setVoiceProfileAdded(true);
    setStep(step + 1);
    setVoiceSubStep("intro");
  };

  const handleVoiceBack = () => {
    setVoiceSubStep("intro");
  };

  const canProceed = () => {
    if (step === 2) return name.trim().length > 0;
    if (step === 3) return communicationMethods.length > 0;
    if (step === 4) return challenges.length > 0;
    return true;
  };

  return (
    <View className="h-full bg-[#FFFBF5] flex flex-col relative">
      {/* Decorative background */}
      <View className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <View className="absolute top-20 -left-20 w-80 h-80 bg-[#10B981]/15 rounded-full blur-3xl"></View>
        <View className="absolute bottom-32 -right-20 w-80 h-80 bg-[#FFB3C6]/20 rounded-full blur-3xl"></View>
        <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6B5CAC]/10 rounded-full blur-3xl"></View>
      </View>

      {/* Progress bar */}
      <View 
        className="relative px-6 pt-6 pb-4" 
        role="progressbar" 
        aria-valuenow={Math.round(((step + 1) / totalSteps) * 100)} 
        aria-valuemin={0} 
        aria-valuemax={100} 
        aria-label={`Onboarding progress: step ${step + 1} of ${totalSteps}`}
      >
        <View className="h-1.5 bg-white/60 rounded-full overflow-hidden backdrop-blur-sm">
          <Animated.View
            className="h-full bg-gradient-to-r from-[#6B5CAC] to-[#FF85A2]"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </View>
        <Text className="sr-only">Step {step + 1} of {totalSteps}</Text>
      </View>

      {/* Content */}
      <View className="relative flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Step 0: Welcome - FRIENDLY FIRST */}
          {step === 0 && (
            <OnboardingStep key="welcome" className="py-8">
              <header className="text-center max-w-md mx-auto" role="banner" aria-labelledby="onboarding-title">
                <motion.h1
                  id="onboarding-title"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-[#2A0098] mb-3"
                >
                  Welcome to Coda
                </motion.h1>
                
                <Animated.View
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-[#6B5CAC] mb-6"
                  aria-label="Coda tagline"
                  style={{ fontSize: '1.125rem' }}
                >
                  Your independence companion
                </Animated.View>
                
                <Animated.View
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-[#2A0098]"
                  aria-describedby="onboarding-title"
                >
                  Built for your focus, your environment, and your voice. Let's personalise your experience in just a few steps.
                </Animated.View>
              </header>
            </OnboardingStep>
          )}

          {/* Step 1: GDPR Consent - Important but after welcome */}
          {step === 1 && (
            <Animated.View
              key="gdpr-consent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <GDPRConsent onAccept={handleGDPRAccept} onDecline={handleGDPRDecline} />
            </Animated.View>
          )}

          {/* Step 2: Name */}
          {step === 2 && (
            <OnboardingStep key="name" className="py-8">
              <View className="w-full max-w-md mx-auto">
                <Text className="text-[#2A0098] mb-2 text-center">What should we call you?</Text>
                <Text className="text-[#6B5CAC] text-center mb-8">We'll use this to make Coda feel more personal</Text>
                
                <View className="space-y-2">
                  <Label htmlFor="name-input" className="text-[#2A0098]">Your name</Label>
                  <Input
                    id="name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && name.trim()) {
                        handleNext();
                      }
                    }}
                    placeholder="e.g., Alex"
                    className="bg-white/60 backdrop-blur-xl border-white/80 text-[#2A0098] placeholder:text-[#6B5CAC]/50 rounded-2xl h-14 px-5 focus:ring-2 focus:ring-[#6B5CAC] focus:border-transparent"
                    autoFocus
                    aria-required="true"
                    aria-describedby="name-description"
                  />
                  <Text id="name-description" className="text-[#6B5CAC] text-sm">
                    This helps personalise your Coda experience
                  </Text>
                </View>
              </View>
            </OnboardingStep>
          )}

          {/* Step 3: Communication Methods */}
          {step === 3 && (
            <OnboardingStep key="communication" className="py-8">
              <View className="w-full max-w-md mx-auto">
                <Text className="text-[#2A0098] mb-2 text-center">How do you communicate?</Text>
                <Text className="text-[#6B5CAC] text-center mb-8">Select all that apply so we can tailor Coda to you</Text>
                
                <fieldset className="space-y-3">
                  <legend className="sr-only">Communication methods</legend>
                  {communicationOptions.map((option, index) => (
                    <Animated.View
                      key={option.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <label
                        htmlFor={`comm-${option.id}`}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          communicationMethods.includes(option.id)
                            ? "bg-gradient-to-br from-[#6B5CAC]/10 to-[#FF85A2]/10 border-[#6B5CAC]"
                            : "bg-white/40 backdrop-blur-xl border-white/60 hover:border-[#6B5CAC]/50"
                        }`}
                      >
                        <Checkbox
                          id={`comm-${option.id}`}
                          checked={communicationMethods.includes(option.id)}
                          onCheckedChange={() => handleCommunicationToggle(option.id)}
                          className="data-[state=checked]:bg-[#6B5CAC] data-[state=checked]:border-[#6B5CAC]"
                        />
                        <Text className="text-[#2A0098] flex-1">{option.label}</Text>
                      </label>
                    </Animated.View>
                  ))}
                </fieldset>
              </View>
            </OnboardingStep>
          )}

          {/* Step 4: Challenges */}
          {step === 4 && (
            <OnboardingStep key="challenges" className="py-8">
              <View className="w-full max-w-md mx-auto">
                <Text className="text-[#2A0098] mb-2 text-center">What are your biggest challenges?</Text>
                <Text className="text-[#6B5CAC] text-center mb-8">This helps us prioritise the features you'll find most useful</Text>
                
                <fieldset className="space-y-3">
                  <legend className="sr-only">Current challenges</legend>
                  {challengeOptions.map((option, index) => (
                    <Animated.View
                      key={option.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <label
                        htmlFor={`challenge-${option.id}`}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          challenges.includes(option.id)
                            ? "bg-gradient-to-br from-[#10B981]/10 to-[#FF85A2]/10 border-[#10B981]"
                            : "bg-white/40 backdrop-blur-xl border-white/60 hover:border-[#10B981]/50"
                        }`}
                      >
                        <Checkbox
                          id={`challenge-${option.id}`}
                          checked={challenges.includes(option.id)}
                          onCheckedChange={() => handleChallengeToggle(option.id)}
                          className="data-[state=checked]:bg-[#10B981] data-[state=checked]:border-[#10B981]"
                        />
                        <Text className="text-[#2A0098] flex-1">{option.label}</Text>
                      </label>
                    </Animated.View>
                  ))}
                </fieldset>
              </View>
            </OnboardingStep>
          )}

          {/* Step 5: Voice Calibration */}
          {step === 5 && (
            <OnboardingStep key="voice" className="py-6">
              {voiceSubStep === "intro" ? (
                <OnboardingVoiceSetup
                  userName={name}
                  onContinue={handleAddVoice}
                  onSkip={handleSkipVoice}
                />
              ) : (
                <AddVoiceProfile
                  onComplete={handleVoiceComplete}
                  onBack={handleVoiceBack}
                  ownerName={name}
                />
              )}
            </OnboardingStep>
          )}

          {/* Step 6: Permissions - This was Step 5 */}
          {step === 6 && (
            <OnboardingStep key="permissions" className="py-8">
              <View className="w-full max-w-md mx-auto">
                <Text className="text-[#2A0098] mb-2 text-center">Coda needs a few permissions</Text>
                <Text className="text-[#6B5CAC] text-center mb-8">Here's exactly why we need each one</Text>
                
                <View className="space-y-3" role="list" aria-label="Required permissions">
                  <Animated.View
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/80"
                    role="listitem"
                  >
                    <View className="flex items-start gap-3">
                      <View className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF85A2] to-[#FFB3C6] flex items-center justify-center flex-shrink-0" aria-hidden="true">
                        <Mic className="w-5 h-5 text-white" strokeWidth={2} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-[#2A0098] mb-1">Microphone</Text>
                        <Text className="text-[#6B5CAC] text-sm">So Talk can transcribe conversations and Aware can detect environmental sounds</Text>
                      </View>
                    </View>
                  </Animated.View>

                  <Animated.View
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/80"
                    role="listitem"
                  >
                    <View className="flex items-start gap-3">
                      <View className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6B5CAC] to-[#8B7BC8] flex items-center justify-center flex-shrink-0" aria-hidden="true">
                        <Bell className="w-5 h-5 text-white" strokeWidth={2} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-[#2A0098] mb-1">Notifications</Text>
                        <Text className="text-[#6B5CAC] text-sm">For silent, haptic alerts from Pomodoro timers and important sounds</Text>
                      </View>
                    </View>
                  </Animated.View>

                  <Animated.View
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/80"
                    role="listitem"
                  >
                    <View className="flex items-start gap-3">
                      <View className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] flex items-center justify-center flex-shrink-0" aria-hidden="true">
                        <Calendar className="w-5 h-5 text-white" strokeWidth={2} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-[#2A0098] mb-1">Calendar</Text>
                        <Text className="text-[#6B5CAC] text-sm">To help you prepare for lectures with Launchpad pre-session briefings</Text>
                      </View>
                    </View>
                  </Animated.View>
                </View>
              </View>
            </OnboardingStep>
          )}

          {/* Step 7: Module Tour - This was Step 6 */}
          {step === 7 && (
            <OnboardingStep key="tour" className="py-8">
              <View className="w-full max-w-md mx-auto">
                <Text className="text-[#2A0098] mb-2 text-center">Your five core modules</Text>
                <Text className="text-[#6B5CAC] text-center mb-8">Everything you need, right at your fingertips</Text>
                
                <View className="space-y-3" role="list" aria-label="Core modules">
                  {[
                    { icon: Radar, color: "from-[#6B5CAC] to-[#8B7BC8]", title: "Aware", desc: "360° environmental sound radar" },
                    { icon: MessageCircle, color: "from-[#FF85A2] to-[#FFB3C6]", title: "Talk", desc: "Live transcription with speaker ID" },
                    { icon: Users, color: "from-[#10B981] to-[#34D399]", title: "Connect", desc: "BSL events & Sensory Scout ratings" },
                    { icon: BookOpen, color: "from-[#F59E0B] to-[#FBBF24]", title: "Study", desc: "Haptic Pomodoro & Launchpad prep" },
                    { icon: Bell, color: "from-[#FF85A2] to-[#FFB3C6]", title: "Alerts", desc: "Customisable sound notifications" },
                  ].map((module, i) => {
                    const Icon = module.icon;
                    return (
                      <Animated.View
                        key={module.title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/80"
                        role="listitem"
                      >
                        <View className="flex items-center gap-3">
                          <View className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center flex-shrink-0 shadow-md`} aria-hidden="true">
                            <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                          </View>
                          <View className="flex-1">
                            <Text className="text-[#2A0098] mb-0.5">{module.title}</Text>
                            <Text className="text-[#6B5CAC] text-sm">{module.desc}</Text>
                          </View>
                        </View>
                      </Animated.View>
                    );
                  })}
                </View>
              </View>
            </OnboardingStep>
          )}
        
      </View>

      {/* Navigation */}
      {step !== 1 && step !== 5 && (
        <View className="relative px-6 pb-8 pt-4">
          <Animated.View
            onPress={handleNext}
            disabled={!canProceed()}
            className={`w-full py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#2A0098] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] ${
              canProceed()
                ? "bg-gradient-to-r from-[#6B5CAC] to-[#FF85A2] text-white hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                : "bg-white/40 text-[#6B5CAC]/50 cursor-not-allowed"
            }`}
            whileTap={canProceed() ? { scale: 0.98 } : {}}
            aria-label={step === totalSteps - 1 ? "Complete onboarding and start using Coda" : "Continue to next step"}
            aria-disabled={!canProceed()}
          >
            <span>{step === totalSteps - 1 ? "Let's Go!" : "Continue"}</Text>
            <ChevronRight className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
          </Animated.View>
          
          {step > 0 && (
            <Animated.View
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-[#6B5CAC] text-sm mt-3"
              aria-hidden="true"
            >
              Step {step + 1} of {totalSteps}
            </Animated.View>
          )}
        </View>
      )}
    </View>
  );
}
