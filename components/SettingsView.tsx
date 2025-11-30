import { View, Text } from 'react-native';
import { useState, useEffect } from "react";
import { ArrowLeft, Volume2, Vibrate, Moon, Trash2, User, Bell as BellIcon, BookOpen, Type } from "lucide-react-native";
import { motion, AnimatePresence } from "react-native-reanimated";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { toast } from "react-native-toast-message";

interface SettingsViewProps {
  onClose: () => void;
  userName?: string;
}

interface VoiceProfile {
  id: string;
  name: string;
  dateAdded: string;
}

export function SettingsView({ onClose, userName = "there" }: SettingsViewProps) {
  const [hapticIntensity, setHapticIntensity] = useState([75]);
  const [bslCaptions, setBslCaptions] = useState(true);
  const [quietHours, setQuietHours] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfile[]>([
    { id: "1", name: "Mum", dateAdded: "2 weeks ago" },
    { id: "2", name: "Prof. Martinez", dateAdded: "5 days ago" },
    { id: "3", name: "Emma (flatmate)", dateAdded: "Yesterday" },
  ]);

  // Dyslexia-friendly reading settings
  const [lineSpacing, setLineSpacing] = useState([150]); // 150% = 1.5
  const [letterSpacing, setLetterSpacing] = useState([0]); // 0-5px
  const [wordSpacing, setWordSpacing] = useState([0]); // 0-10px
  const [fontFamily, setFontFamily] = useState("inter");
  const [textSize, setTextSize] = useState([100]); // 100% = base
  const [colorOverlay, setColorOverlay] = useState("none");
  const [paragraphSpacing, setParagraphSpacing] = useState([100]); // 100% = normal
  const [colorTheme, setColorTheme] = useState("default"); // App color theme

  const handleDeleteProfile = (id: string, name: string) => {
    setVoiceProfiles(prev => prev.filter(p => p.id !== id));
    toast.success(`Deleted voice profile: ${name}`);
  };

  const handleHapticChange = (value: number[]) => {
    setHapticIntensity(value);
    // Simulate haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(value[0]);
    }
  };

  // Load dyslexia settings from localStorage
  useEffect(() => {
    const saved = await storage.getItem("coda-dyslexia-settings");
    if (saved) {
      const settings = JSON.parse(saved);
      setLineSpacing(settings.lineSpacing || [150]);
      setLetterSpacing(settings.letterSpacing || [0]);
      setWordSpacing(settings.wordSpacing || [0]);
      setFontFamily(settings.fontFamily || "inter");
      setTextSize(settings.textSize || [100]);
      setColorOverlay(settings.colorOverlay || "none");
      setParagraphSpacing(settings.paragraphSpacing || [100]);
      setColorTheme(settings.colorTheme || "default");
    }
  }, []);

  // Apply dyslexia settings to document root
  useEffect(() => {
    const settings = {
      lineSpacing,
      letterSpacing,
      wordSpacing,
      fontFamily,
      textSize,
      colorOverlay,
      paragraphSpacing,
      colorTheme,
    };
    await storage.setItem("coda-dyslexia-settings", JSON.stringify(settings));

    // Apply CSS custom properties
    const root = // document.documentElement - removed for RN;
    root.style.setProperty("--dyslexia-line-spacing", `${lineSpacing[0] / 100}`);
    root.style.setProperty("--dyslexia-letter-spacing", `${letterSpacing[0] / 10}px`);
    root.style.setProperty("--dyslexia-word-spacing", `${wordSpacing[0] / 10}px`);
    root.style.setProperty("--dyslexia-text-size", `${textSize[0] / 100}`);
    root.style.setProperty("--dyslexia-paragraph-spacing", `${paragraphSpacing[0] / 100}em`);
    
    // Apply font family
    if (fontFamily === "dyslexic") {
      root.style.setProperty("--font-sans", "'Comic Sans MS', 'Comic Sans', cursive, sans-serif");
    } else if (fontFamily === "arial") {
      root.style.setProperty("--font-sans", "Arial, sans-serif");
    } else {
      root.style.setProperty("--font-sans", "'Inter', sans-serif");
    }

    // Apply color overlay
    root.setAttribute("data-color-overlay", colorOverlay);
    
    // Apply color theme
    root.setAttribute("data-color-theme", colorTheme);
  }, [lineSpacing, letterSpacing, wordSpacing, fontFamily, textSize, colorOverlay, paragraphSpacing, colorTheme]);

  const resetDyslexiaSettings = () => {
    setLineSpacing([150]);
    setLetterSpacing([0]);
    setWordSpacing([0]);
    setFontFamily("inter");
    setTextSize([100]);
    setColorOverlay("none");
    setParagraphSpacing([100]);
    setColorTheme("default");
    toast.success("Reading preferences reset to defaults");
  };

  return (
    <View className="h-full flex flex-col bg-[#FFFBF5]">
      {/* Header */}
      <View className="px-6 py-5 bg-white/60 backdrop-blur-xl border-b border-white/80">
        <View className="flex items-center gap-3">
          <button
            onPress={onClose}
            className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#2A0098] transition-all"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-[#2A0098]" strokeWidth={2} aria-hidden="true" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-[#2A0098]">Settings</Text>
            <Text className="text-[#6B5CAC] text-sm">Customise your Coda experience</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Reading Preferences (Dyslexia-Friendly) Section */}
        <View className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-lg p-6 space-y-5">
          <View className="flex items-center gap-3 mb-2">
            <View className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6B5CAC] to-[#8B7BC8] flex items-center justify-center" aria-hidden="true">
              <BookOpen className="w-5 h-5 text-white" strokeWidth={2} aria-hidden="true" />
            </View>
            <View className="flex-1">
              <Text className="text-[#2A0098]">Reading Preferences</Text>
              <Text className="text-[#6B5CAC] text-xs mt-0.5">Dyslexia-friendly options</Text>
            </View>
          </View>

          {/* Line Spacing */}
          <View className="space-y-3">
            <View className="flex items-center justify-between">
              <label htmlFor="line-spacing-slider" className="text-[#2A0098] text-sm">
                Line Spacing
              </label>
              <Text className="text-[#6B5CAC] text-sm">{(lineSpacing[0] / 100).toFixed(1)}x</Text>
            </View>
            <Slider
              id="line-spacing-slider"
              value={lineSpacing}
              onValueChange={setLineSpacing}
              min={120}
              max={250}
              step={10}
              className="w-full"
              aria-label="Adjust line spacing"
            />
          </View>

          {/* Letter Spacing */}
          <View className="space-y-3 border-t border-white/50 pt-5">
            <View className="flex items-center justify-between">
              <label htmlFor="letter-spacing-slider" className="text-[#2A0098] text-sm">
                Letter Spacing
              </label>
              <Text className="text-[#6B5CAC] text-sm">{letterSpacing[0] === 0 ? "Normal" : `+${(letterSpacing[0] / 10).toFixed(1)}px`}</Text>
            </View>
            <Slider
              id="letter-spacing-slider"
              value={letterSpacing}
              onValueChange={setLetterSpacing}
              min={0}
              max={30}
              step={5}
              className="w-full"
              aria-label="Adjust letter spacing"
            />
          </View>

          {/* Word Spacing */}
          <View className="space-y-3 border-t border-white/50 pt-5">
            <View className="flex items-center justify-between">
              <label htmlFor="word-spacing-slider" className="text-[#2A0098] text-sm">
                Word Spacing
              </label>
              <Text className="text-[#6B5CAC] text-sm">{wordSpacing[0] === 0 ? "Normal" : `+${(wordSpacing[0] / 10).toFixed(1)}px`}</Text>
            </View>
            <Slider
              id="word-spacing-slider"
              value={wordSpacing}
              onValueChange={setWordSpacing}
              min={0}
              max={50}
              step={5}
              className="w-full"
              aria-label="Adjust word spacing"
            />
          </View>

          {/* Text Size */}
          <View className="space-y-3 border-t border-white/50 pt-5">
            <View className="flex items-center justify-between">
              <label htmlFor="text-size-slider" className="text-[#2A0098] text-sm">
                Text Size
              </label>
              <Text className="text-[#6B5CAC] text-sm">{textSize[0]}%</Text>
            </View>
            <Slider
              id="text-size-slider"
              value={textSize}
              onValueChange={setTextSize}
              min={80}
              max={150}
              step={10}
              className="w-full"
              aria-label="Adjust text size"
            />
          </View>

          {/* Paragraph Spacing */}
          <View className="space-y-3 border-t border-white/50 pt-5">
            <View className="flex items-center justify-between">
              <label htmlFor="paragraph-spacing-slider" className="text-[#2A0098] text-sm">
                Paragraph Spacing
              </label>
              <Text className="text-[#6B5CAC] text-sm">{paragraphSpacing[0]}%</Text>
            </View>
            <Slider
              id="paragraph-spacing-slider"
              value={paragraphSpacing}
              onValueChange={setParagraphSpacing}
              min={100}
              max={200}
              step={25}
              className="w-full"
              aria-label="Adjust paragraph spacing"
            />
          </View>

          {/* Font Family Selection */}
          <View className="space-y-3 border-t border-white/50 pt-5">
            <label className="text-[#2A0098] text-sm flex items-center gap-2">
              <Type className="w-4 h-4 text-[#6B5CAC]" strokeWidth={2} aria-hidden="true" />
              Font Style
            </label>
            <View className="grid grid-cols-1 gap-2">
              <button
                onPress={() => setFontFamily("inter")}
                className={`p-3 rounded-xl border transition-all text-left ${
                  fontFamily === "inter"
                    ? "bg-[#2A0098] text-white border-[#2A0098]"
                    : "bg-white/50 text-[#2A0098] border-white/60 hover:border-[#2A0098]/40"
                }`}
                aria-pressed={fontFamily === "inter"}
              >
                <Text style={{ fontFamily: "'Inter', sans-serif" }}>Inter (Default)</Text>
              </TouchableOpacity>
              <button
                onPress={() => setFontFamily("dyslexic")}
                className={`p-3 rounded-xl border transition-all text-left ${
                  fontFamily === "dyslexic"
                    ? "bg-[#2A0098] text-white border-[#2A0098]"
                    : "bg-white/50 text-[#2A0098] border-white/60 hover:border-[#2A0098]/40"
                }`}
                aria-pressed={fontFamily === "dyslexic"}
              >
                <Text style={{ fontFamily: "'Comic Sans MS', cursive" }}>Dyslexia-Friendly</Text>
              </TouchableOpacity>
              <button
                onPress={() => setFontFamily("arial")}
                className={`p-3 rounded-xl border transition-all text-left ${
                  fontFamily === "arial"
                    ? "bg-[#2A0098] text-white border-[#2A0098]"
                    : "bg-white/50 text-[#2A0098] border-white/60 hover:border-[#2A0098]/40"
                }`}
                aria-pressed={fontFamily === "arial"}
              >
                <Text style={{ fontFamily: "Arial, sans-serif" }}>Arial (Simple)</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Color Theme Selection */}
          <View className="space-y-3 border-t border-white/50 pt-5">
            <label className="text-[#2A0098] text-sm">
              Color Theme (interface colors & contrast)
            </label>
            <Text className="text-[#6B5CAC] text-xs">
              Lower contrast themes reduce visual stress for dyslexia
            </Text>
            <View className="grid grid-cols-1 gap-2">
              <button
                onPress={() => setColorTheme("default")}
                className={`p-3 rounded-xl border transition-all text-left flex items-center gap-3 ${
                  colorTheme === "default"
                    ? "bg-[#FFFBF5] border-[#2A0098] ring-2 ring-[#2A0098]"
                    : "bg-[#FFFBF5]/50 border-white/60 hover:border-[#2A0098]/40"
                }`}
                aria-pressed={colorTheme === "default"}
              >
                <View className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFFBF5] to-[#FFF8EF] border border-[#2A0098]/20"></View>
                <div>
                  <View className="text-sm" style={{ color: '#2A0098' }}>Warm Cream (Default)</View>
                  <View className="text-xs" style={{ color: '#6B5CAC' }}>Original Coda palette</View>
                </View>
              </TouchableOpacity>
              <button
                onPress={() => setColorTheme("soft-beige")}
                className={`p-3 rounded-xl border transition-all text-left flex items-center gap-3 ${
                  colorTheme === "soft-beige"
                    ? "bg-[#F5F0E8] border-[#8B7355] ring-2 ring-[#8B7355]"
                    : "bg-[#F5F0E8]/50 border-white/60 hover:border-[#8B7355]/40"
                }`}
                aria-pressed={colorTheme === "soft-beige"}
              >
                <View className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F5F0E8] to-[#EAE0D5] border border-[#8B7355]/20"></View>
                <div>
                  <View className="text-sm" style={{ color: '#5C4D3D' }}>Soft Beige</View>
                  <View className="text-xs" style={{ color: '#8B7355' }}>Low contrast, warm tones</View>
                </View>
              </TouchableOpacity>
              <button
                onPress={() => setColorTheme("soft-blue")}
                className={`p-3 rounded-xl border transition-all text-left flex items-center gap-3 ${
                  colorTheme === "soft-blue"
                    ? "bg-[#E8F4F8] border-[#4A7C9C] ring-2 ring-[#4A7C9C]"
                    : "bg-[#E8F4F8]/50 border-white/60 hover:border-[#4A7C9C]/40"
                }`}
                aria-pressed={colorTheme === "soft-blue"}
              >
                <View className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E8F4F8] to-[#D5E9F2] border border-[#4A7C9C]/20"></View>
                <div>
                  <View className="text-sm" style={{ color: '#2C5F7C' }}>Soft Blue</View>
                  <View className="text-xs" style={{ color: '#4A7C9C' }}>Calm, reduced glare</View>
                </View>
              </TouchableOpacity>
              <button
                onPress={() => setColorTheme("soft-green")}
                className={`p-3 rounded-xl border transition-all text-left flex items-center gap-3 ${
                  colorTheme === "soft-green"
                    ? "bg-[#EDF7ED] border-[#5C8D5C] ring-2 ring-[#5C8D5C]"
                    : "bg-[#EDF7ED]/50 border-white/60 hover:border-[#5C8D5C]/40"
                }`}
                aria-pressed={colorTheme === "soft-green"}
              >
                <View className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#EDF7ED] to-[#DCEFD5] border border-[#5C8D5C]/20"></View>
                <div>
                  <View className="text-sm" style={{ color: '#3D6B3D' }}>Soft Green</View>
                  <View className="text-xs" style={{ color: '#5C8D5C' }}>Natural, easy on eyes</View>
                </View>
              </TouchableOpacity>
              <button
                onPress={() => setColorTheme("soft-grey")}
                className={`p-3 rounded-xl border transition-all text-left flex items-center gap-3 ${
                  colorTheme === "soft-grey"
                    ? "bg-[#F0F0F0] border-[#666666] ring-2 ring-[#666666]"
                    : "bg-[#F0F0F0]/50 border-white/60 hover:border-[#666666]/40"
                }`}
                aria-pressed={colorTheme === "soft-grey"}
              >
                <View className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F0F0F0] to-[#E5E5E5] border border-[#666666]/20"></View>
                <div>
                  <View className="text-sm" style={{ color: '#4A4A4A' }}>Soft Grey</View>
                  <View className="text-xs" style={{ color: '#666666' }}>Minimal contrast, neutral</View>
                </View>
              </TouchableOpacity>
              <button
                onPress={() => setColorTheme("high-contrast")}
                className={`p-3 rounded-xl border transition-all text-left flex items-center gap-3 ${
                  colorTheme === "high-contrast"
                    ? "bg-white border-black ring-2 ring-black"
                    : "bg-white/50 border-white/60 hover:border-black/40"
                }`}
                aria-pressed={colorTheme === "high-contrast"}
              >
                <View className="w-8 h-8 rounded-lg bg-gradient-to-br from-white to-[#F5F5F5] border-2 border-black/40"></View>
                <div>
                  <View className="text-sm" style={{ color: 'black' }}>High Contrast</View>
                  <View className="text-xs" style={{ color: '#666666' }}>Maximum visibility</View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Color Overlay Selection */}
          <View className="space-y-3 border-t border-white/50 pt-5">
            <label className="text-[#2A0098] text-sm">
              Additional Color Tint (optional)
            </label>
            <Text className="text-[#6B5CAC] text-xs">
              Adds a subtle overlay on top of your theme
            </Text>
            <View className="grid grid-cols-3 gap-2">
              <button
                onPress={() => setColorOverlay("none")}
                className={`p-3 rounded-xl border transition-all ${
                  colorOverlay === "none"
                    ? "bg-[#2A0098] text-white border-[#2A0098]"
                    : "bg-white text-[#2A0098] border-white/60 hover:border-[#2A0098]/40"
                }`}
                aria-pressed={colorOverlay === "none"}
              >
                None
              </TouchableOpacity>
              <button
                onPress={() => setColorOverlay("beige")}
                className={`p-3 rounded-xl border transition-all ${
                  colorOverlay === "beige"
                    ? "bg-[#F5DEB3] text-[#2A0098] border-[#F5DEB3] ring-2 ring-[#2A0098]"
                    : "bg-[#F5DEB3]/30 text-[#2A0098] border-[#F5DEB3] hover:border-[#F5DEB3]"
                }`}
                aria-pressed={colorOverlay === "beige"}
              >
                Beige
              </TouchableOpacity>
              <button
                onPress={() => setColorOverlay("blue")}
                className={`p-3 rounded-xl border transition-all ${
                  colorOverlay === "blue"
                    ? "bg-[#ADD8E6] text-[#2A0098] border-[#ADD8E6] ring-2 ring-[#2A0098]"
                    : "bg-[#ADD8E6]/30 text-[#2A0098] border-[#ADD8E6] hover:border-[#ADD8E6]"
                }`}
                aria-pressed={colorOverlay === "blue"}
              >
                Blue
              </TouchableOpacity>
              <button
                onPress={() => setColorOverlay("yellow")}
                className={`p-3 rounded-xl border transition-all ${
                  colorOverlay === "yellow"
                    ? "bg-[#FFFFE0] text-[#2A0098] border-[#FFFFE0] ring-2 ring-[#2A0098]"
                    : "bg-[#FFFFE0]/30 text-[#2A0098] border-[#FFFFE0] hover:border-[#FFFFE0]"
                }`}
                aria-pressed={colorOverlay === "yellow"}
              >
                Yellow
              </TouchableOpacity>
              <button
                onPress={() => setColorOverlay("green")}
                className={`p-3 rounded-xl border transition-all ${
                  colorOverlay === "green"
                    ? "bg-[#D8FDCC] text-[#2A0098] border-[#D8FDCC] ring-2 ring-[#2A0098]"
                    : "bg-[#D8FDCC]/30 text-[#2A0098] border-[#D8FDCC] hover:border-[#D8FDCC]"
                }`}
                aria-pressed={colorOverlay === "green"}
              >
                Green
              </TouchableOpacity>
              <button
                onPress={() => setColorOverlay("pink")}
                className={`p-3 rounded-xl border transition-all ${
                  colorOverlay === "pink"
                    ? "bg-[#FFB3C6] text-[#2A0098] border-[#FFB3C6] ring-2 ring-[#2A0098]"
                    : "bg-[#FFB3C6]/30 text-[#2A0098] border-[#FFB3C6] hover:border-[#FFB3C6]"
                }`}
                aria-pressed={colorOverlay === "pink"}
              >
                Pink
              </TouchableOpacity>
            </View>
          </View>

          {/* Reset Button */}
          <View className="border-t border-white/50 pt-5">
            <button
              onPress={resetDyslexiaSettings}
              className="mx-auto block px-8 py-3 rounded-xl bg-[#6B5CAC]/10 hover:bg-[#6B5CAC]/20 text-[#6B5CAC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6B5CAC]"
            >
              Reset to defaults
            </TouchableOpacity>
          </View>
        </View>

        {/* Accessibility Section */}
        <View className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-lg p-6 space-y-5">
          <View className="flex items-center gap-3 mb-2">
            <View className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF85A2] to-[#FFB3C6] flex items-center justify-center" aria-hidden="true">
              <Volume2 className="w-5 h-5 text-white" strokeWidth={2} aria-hidden="true" />
            </View>
            <Text className="text-[#2A0098]">Accessibility</Text>
          </View>

          {/* Haptic Intensity */}
          <View className="space-y-3">
            <View className="flex items-center justify-between">
              <View className="flex items-center gap-2">
                <Vibrate className="w-4 h-4 text-[#6B5CAC]" strokeWidth={2} aria-hidden="true" />
                <label htmlFor="haptic-slider" className="text-[#2A0098] text-sm">
                  Haptic Intensity
                </label>
              </View>
              <Text className="text-[#6B5CAC] text-sm">{hapticIntensity[0]}%</Text>
            </View>
            <Slider
              id="haptic-slider"
              value={hapticIntensity}
              onValueChange={handleHapticChange}
              max={100}
              step={5}
              className="w-full"
              aria-label="Adjust haptic feedback intensity"
            />
          </View>

          {/* BSL Captions */}
          <View className="flex items-center justify-between py-3 border-t border-white/50">
            <div>
              <Text className="text-[#2A0098] text-sm">BSL Video Captions</Text>
              <Text className="text-[#6B5CAC] text-xs mt-0.5">Show subtitles on BSL content</Text>
            </View>
            <Switch
              checked={bslCaptions}
              onCheckedChange={(checked) => {
                setBslCaptions(checked);
                toast.success(checked ? "BSL captions enabled" : "BSL captions disabled");
              }}
              aria-label="Toggle BSL video captions"
            />
          </View>

          {/* Quiet Hours */}
          <View className="flex items-center justify-between py-3 border-t border-white/50">
            <div>
              <Text className="text-[#2A0098] text-sm">Quiet Hours</Text>
              <Text className="text-[#6B5CAC] text-xs mt-0.5">Mute non-urgent alerts (10pm-8am)</Text>
            </View>
            <Switch
              checked={quietHours}
              onCheckedChange={(checked) => {
                setQuietHours(checked);
                toast.success(checked ? "Quiet hours enabled" : "Quiet hours disabled");
              }}
              aria-label="Toggle quiet hours for alerts"
            />
          </View>

          {/* Dark Mode */}
          <View className="flex items-center justify-between py-3 border-t border-white/50">
            <View className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-[#6B5CAC]" strokeWidth={2} aria-hidden="true" />
              <div>
                <Text className="text-[#2A0098] text-sm">Dark Mode</Text>
                <Text className="text-[#6B5CAC] text-xs mt-0.5">Coming soon</Text>
              </View>
            </View>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              disabled
              aria-label="Toggle dark mode (coming soon)"
            />
          </View>
        </View>

        {/* Voice Profiles Section */}
        <View className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-lg p-6 space-y-4">
          <View className="flex items-center gap-3 mb-2">
            <View className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6B5CAC] to-[#8B7BC8] flex items-center justify-center" aria-hidden="true">
              <User className="w-5 h-5 text-white" strokeWidth={2} aria-hidden="true" />
            </View>
            <View className="flex-1">
              <Text className="text-[#2A0098]">Saved Voice Profiles</Text>
              <Text className="text-[#6B5CAC] text-xs mt-0.5">{voiceProfiles.length} profile{voiceProfiles.length !== 1 ? 's' : ''} saved</Text>
            </View>
          </View>

          {/* Voice Profiles List */}
          <View className="space-y-2">
            <AnimatePresence mode="popLayout">
              {voiceProfiles.map((profile) => (
                <Animated.View
                  key={profile.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/50 border border-white/60"
                >
                  <div>
                    <Text className="text-[#2A0098] text-sm">{profile.name}</Text>
                    <Text className="text-[#6B5CAC] text-xs">Added {profile.dateAdded}</Text>
                  </View>
                  <button
                    onPress={() => handleDeleteProfile(profile.id, profile.name)}
                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
                    aria-label={`Delete voice profile for ${profile.name}`}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" strokeWidth={2} aria-hidden="true" />
                  </TouchableOpacity>
                </Animated.View>
              ))}
            

            {voiceProfiles.length === 0 && (
              <View className="text-center py-8">
                <Text className="text-[#6B5CAC] text-sm">No voice profiles yet</Text>
                <Text className="text-[#6B5CAC] text-xs mt-1">Add profiles in the Talk section</Text>
              </View>
            )}
          </View>
        </View>

        {/* Notifications Section */}
        <View className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-lg p-6 space-y-4">
          <View className="flex items-center gap-3 mb-2">
            <View className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D8FDCC] to-[#A8E6CF] flex items-center justify-center" aria-hidden="true">
              <BellIcon className="w-5 h-5 text-[#2A0098]" strokeWidth={2} aria-hidden="true" />
            </View>
            <Text className="text-[#2A0098]">Notifications</Text>
          </View>

          <View className="text-center py-6">
            <Text className="text-[#6B5CAC] text-sm">Customise notification preferences</Text>
            <Text className="text-[#6B5CAC] text-xs mt-1">Manage in the Alerts section</Text>
          </View>
        </View>

        {/* About Section */}
        <View className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-lg p-6 text-center">
          <Text className="text-[#2A0098] text-sm">Coda v1.0.0</Text>
          <Text className="text-[#6B5CAC] text-xs mt-1">
            Built for Deaf students to thrive independently
          </Text>
          <Text className="text-[#6B5CAC] text-xs mt-3">
            Made with care in the UK 🇬🇧
          </Text>
        </View>

        {/* Reset Onboarding (for testing) */}
        <View className="bg-white/50 backdrop-blur-xl rounded-2xl p-4 border border-white/60">
          <button
            onPress={() => {
              await storage.removeItem("coda-onboarding-complete");
              toast.success("Onboarding reset - refresh page to see it again");
            }}
            className="w-full py-3 rounded-xl bg-[#6B5CAC]/10 hover:bg-[#6B5CAC]/20 text-[#6B5CAC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] flex items-center justify-center"
          >
            Reset onboarding
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
