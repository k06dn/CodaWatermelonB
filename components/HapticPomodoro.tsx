import { View, Text } from 'react-native';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "react-native-reanimated";
import { Play, Pause, RotateCcw, Settings, Smartphone, Check, Sparkles } from "lucide-react-native";
import { toast } from "react-native-toast-message";

type TimerState = "idle" | "focus" | "break" | "paused";
type Preset = "classic" | "deep" | "quick" | "custom";

interface PresetConfig {
  id: Preset;
  name: string;
  focus: number; // minutes
  break: number; // minutes
  description: string;
}

const presets: PresetConfig[] = [
  { id: "classic", name: "Classic", focus: 25, break: 5, description: "Traditional Pomodoro" },
  { id: "deep", name: "Deep Focus", focus: 50, break: 10, description: "Extended concentration" },
  { id: "quick", name: "Quick Sprint", focus: 15, break: 3, description: "Short bursts" },
  { id: "custom", name: "Custom", focus: 30, break: 5, description: "Set your own time" },
];



export function HapticPomodoro() {
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [selectedPreset, setSelectedPreset] = useState<Preset>("classic");
  const [sessionCount, setSessionCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // seconds
  const [showSettings, setShowSettings] = useState(false);
  const [customFocus, setCustomFocus] = useState(30);
  const [customBreak, setCustomBreak] = useState(5);

  const currentPreset = presets.find(p => p.id === selectedPreset) || presets[0];
  const totalTime = timerState === "focus" 
    ? (selectedPreset === "custom" ? customFocus : currentPreset.focus) * 60
    : (selectedPreset === "custom" ? customBreak : currentPreset.break) * 60;
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;

  useEffect(() => {
    if (timerState === "focus" || timerState === "break") {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Timer completed - trigger haptic and switch state
            if (timerState === "focus") {
              setSessionCount(c => c + 1);
              toast.success("Focus session complete! 🎉", {
                description: "Time for a well-deserved break",
              });
              setTimerState("break");
              const breakTime = selectedPreset === "custom" ? customBreak : currentPreset.break;
              return breakTime * 60;
            } else {
              toast.success("Break's over!", {
                description: "Ready for another focus session?",
              });
              setTimerState("idle");
              return (selectedPreset === "custom" ? customFocus : currentPreset.focus) * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timerState, selectedPreset, currentPreset, customFocus, customBreak]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (timerState === "idle") {
      setTimerState("focus");
      const focusTime = selectedPreset === "custom" ? customFocus : currentPreset.focus;
      setTimeRemaining(focusTime * 60);
    } else if (timerState === "paused") {
      setTimerState("focus");
    }
  };

  const pauseTimer = () => {
    setTimerState("paused");
  };

  const resetTimer = () => {
    setTimerState("idle");
    const focusTime = selectedPreset === "custom" ? customFocus : currentPreset.focus;
    setTimeRemaining(focusTime * 60);
  };

  const selectPreset = (preset: Preset) => {
    setSelectedPreset(preset);
    setTimerState("idle");
    const focusTime = preset === "custom" ? customFocus : (presets.find(p => p.id === preset)?.focus || 25);
    setTimeRemaining(focusTime * 60);
  };

  return (
    <View className="h-full overflow-y-auto px-6 py-4 space-y-4">
      {/* Preset Selection */}
      {!showSettings && (
        <Animated.View
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <label className="text-[#2A0098] block text-sm" id="preset-label">
            Choose your interval
          </label>
          <View 
            className="grid grid-cols-2 gap-2"
            role="radiogroup"
            aria-labelledby="preset-label"
          >
            {presets.map((preset) => {
              const isSelected = selectedPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onPress={() => selectPreset(preset.id)}
                  className={`p-3 rounded-xl border-2 transition-all text-left focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] ${
                    isSelected
                      ? "border-[#10B981] bg-gradient-to-br from-[#10B981]/10 to-[#D8FDCC]/20 shadow-md"
                      : "border-white/60 bg-white/40 backdrop-blur-sm hover:bg-white/60"
                  }`}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${preset.name}: ${preset.focus} minute focus, ${preset.break} minute break. ${preset.description}`}
                >
                  <View className="flex items-start justify-between mb-1.5">
                    <Text className="text-[#2A0098] text-sm">{preset.name}</Text>
                    {isSelected && (
                      <View className="w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} aria-hidden="true" />
                      </View>
                    )}
                  </View>
                  <Text className="text-[#6B5CAC] text-xs mb-1">
                    {preset.focus}min / {preset.break}min
                  </Text>
                  <Text className="text-[#6B5CAC] text-xs opacity-80">
                    {preset.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      )}

      {/* Custom Timer Settings */}
      {/* AnimatePresence - replace with conditional render */
        {showSettings && selectedPreset === "custom" && (
          <Animated.View
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/60"
          >
            <Text className="text-[#2A0098] mb-3 text-sm">Custom intervals</Text>
            <View className="space-y-3">
              <div>
                <label htmlFor="custom-focus" className="text-[#2A0098] block mb-1.5 text-sm">
                  Focus time (minutes)
                </label>
                <input
                  id="custom-focus"
                  type="number"
                  min="1"
                  max="120"
                  value={customFocus}
                  onChange={(e) => setCustomFocus(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/60 text-[#2A0098] focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5]"
                  aria-describedby="custom-focus-desc"
                />
                <Text id="custom-focus-desc" className="text-[#6B5CAC] text-xs mt-1">
                  How long to focus before a break
                </Text>
              </View>
              <div>
                <label htmlFor="custom-break" className="text-[#2A0098] block mb-1.5 text-sm">
                  Break time (minutes)
                </label>
                <input
                  id="custom-break"
                  type="number"
                  min="1"
                  max="30"
                  value={customBreak}
                  onChange={(e) => setCustomBreak(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 rounded-xl bg-white/60 border border-white/60 text-[#2A0098] focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5]"
                  aria-describedby="custom-break-desc"
                />
                <Text id="custom-break-desc" className="text-[#6B5CAC] text-xs mt-1">
                  How long to rest between focus sessions
                </Text>
              </View>
            </View>
          </Animated.View>
        )}
      

      {/* Timer Display with Plant */}
      <Animated.View
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/40 backdrop-blur-sm rounded-3xl p-4 border border-white/60 shadow-lg"
      >
        {/* Session Counter & Settings */}
        <View className="flex items-center justify-between mb-3">
          <View className="flex items-center gap-2">
            <View className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <Animated.View
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i <= sessionCount % 4 ? "bg-[#10B981]" : "bg-[#6B5CAC]/20"
                  }`}
                  initial={false}
                  animate={i === (sessionCount % 4) && sessionCount > 0 ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  aria-hidden="true"
                />
              ))}
            </View>
            <Text className="text-[#6B5CAC] text-xs">
              {sessionCount} session{sessionCount !== 1 ? "s" : ""}
            </Text>
          </View>
          <button
            onPress={() => setShowSettings(!showSettings)}
            className="p-1.5 rounded-lg hover:bg-white/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-white/40"
            aria-label={showSettings ? "Hide settings" : "Show settings"}
            aria-expanded={showSettings}
          >
            <Settings 
              className="w-4 h-4 text-[#6B5CAC]" 
              strokeWidth={2}
              aria-hidden="true"
            />
          </TouchableOpacity>
        </View>

        {/* Circular Progress */}
        <View className="flex items-center justify-center mb-4 p-3">
          <View className="relative w-52 h-52">
            <svg className="w-full h-full transform -rotate-90" aria-hidden="true" viewBox="0 0 208 208">
              {/* Background circle */}
              <circle
                cx="104"
                cy="104"
                r="96"
                stroke="#E5E7EB"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="104"
                cy="104"
                r="96"
                stroke={timerState === "focus" ? "#6B5CAC" : "#10B981"}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 96}`}
                strokeDashoffset={`${2 * Math.PI * 96 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>

            {/* Time display */}
            <View className="absolute inset-0 flex flex-col items-center justify-center">
              <Text 
                className="text-4xl text-[#2A0098] tabular-nums"
                aria-live="polite"
                aria-atomic="true"
              >
                {formatTime(timeRemaining)}
              </Text>
              <Text className="text-[#6B5CAC] text-xs mt-1">
                {timerState === "focus" ? "Focus time" : timerState === "break" ? "Break time" : "Ready to start"}
              </Text>
            </View>
          </View>
        </View>

        {/* Control Buttons */}
        <View className="flex gap-2">
          {(timerState === "idle" || timerState === "paused") && (
            <button
              onPress={startTimer}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#10B981] to-[#34D399] text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:ring-offset-2 focus:ring-offset-white/40 transition-all active:scale-[0.98]"
              aria-label={timerState === "paused" ? "Resume timer" : "Start focus session"}
            >
              <Play className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
              <Text className="text-sm">{timerState === "paused" ? "Resume" : "Start"}</Text>
            </TouchableOpacity>
          )}

          {(timerState === "focus" || timerState === "break") && (
            <button
              onPress={pauseTimer}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#6B5CAC] to-[#8B7BC8] text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-white/40 transition-all active:scale-[0.98]"
              aria-label="Pause timer"
            >
              <Pause className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
              <Text className="text-sm">Pause</Text>
            </TouchableOpacity>
          )}

          {timerState !== "idle" && (
            <button
              onPress={resetTimer}
              className="px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/60 hover:bg-white/80 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-white/40 transition-all active:scale-[0.98]"
              aria-label="Reset timer to beginning"
            >
              <RotateCcw className="w-4 h-4 text-[#6B5CAC]" strokeWidth={2} aria-hidden="true" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Motivational Message */}
      {/* AnimatePresence - replace with conditional render */
        {sessionCount > 0 && sessionCount % 4 === 0 && (
          <Animated.View
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="bg-gradient-to-br from-[#10B981]/20 to-[#D8FDCC]/30 backdrop-blur-sm rounded-2xl p-4 border border-[#10B981]/30"
            role="status"
            aria-live="polite"
          >
            <View className="flex items-start gap-3">
              <Animated.View
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Sparkles className="w-5 h-5 text-[#10B981]" strokeWidth={2} aria-hidden="true" />
              </Animated.View>
              <View className="flex-1">
                <Text className="text-[#2A0098] mb-1 text-sm">Great job! 🎉</Text>
                <Text className="text-[#6B5CAC] text-xs leading-relaxed">
                  You've completed {sessionCount} sessions! Keep up the excellent work!
                </Text>
              </View>
            </View>
          </Animated.View>
        )}
      

      {/* Haptic Info */}
      <View 
        className="bg-[#6B5CAC]/10 backdrop-blur-sm rounded-2xl p-3 border border-[#6B5CAC]/20"
        role="region"
        aria-label="Haptic feedback information"
      >
        <View className="flex items-start gap-2.5">
          <View className="w-8 h-8 rounded-lg bg-[#6B5CAC]/20 flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-4 h-4 text-[#2A0098]" strokeWidth={2} aria-hidden="true" />
          </View>
          <View className="flex-1">
            <Text className="text-[#2A0098] mb-0.5 text-sm">Silent vibration alerts</Text>
            <Text className="text-[#6B5CAC] text-xs leading-relaxed">
              Your device pulses gently when sessions start and end. No sound needed—stay focused without disruption.
            </Text>
          </View>
        </View>
      </View>

      {/* Getting Started Tips */}
      {sessionCount === 0 && (
        <Animated.View
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-[#D8FDCC]/20 backdrop-blur-sm rounded-2xl p-3 border border-[#D8FDCC]/40"
        >
          <View className="flex items-start gap-2.5">
            <View className="w-8 h-8 rounded-lg bg-[#D8FDCC]/40 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-[#10B981]" strokeWidth={2} aria-hidden="true" />
            </View>
            <View className="flex-1">
              <Text className="text-[#2A0098] mb-0.5 text-sm">Ready to focus?</Text>
              <Text className="text-[#6B5CAC] text-xs leading-relaxed">
                Choose an interval that works for you and start your first session. Track your progress with the session counter above!
              </Text>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
