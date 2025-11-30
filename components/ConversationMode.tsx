import { View, Text, TouchableOpacity } from 'react-native';
import { motion, AnimatePresence } from "react-native-reanimated";
import { Mic, MicOff, Users, UserPlus, AlertTriangle, Volume2, VolumeX, BookOpen, X, LogOut } from "lucide-react-native";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { VoiceCalibration } from "./VoiceCalibration";
import { TabsList, TabsTrigger } from "./ui/tabs";

interface Speaker {
  id: string;
  name: string;
  initials: string;
  color: string;
  avatarBg: string;
}

type Tone = "neutral" | "excited" | "whispering" | "raised" | "laughing" | "frustrated";
type NonVerbal = "laughter" | "sighs" | "clears throat" | "coughs" | null;

interface Message {
  id: string;
  speakerId: string;
  text: string;
  timestamp: Date;
  isComplete: boolean;
  isContinuation?: boolean;
  confidence?: number; // 0-1, overall confidence
  tone?: Tone;
  nonVerbal?: NonVerbal;
  isInterrupted?: boolean;
  resumesThreadId?: string; // Reference to interrupted message
}

const speakers: Speaker[] = [
  {
    id: "alex",
    name: "Alex",
    initials: "AL",
    color: "#6B5CAC",
    avatarBg: "from-[#6B5CAC] to-[#8B7BC8]",
  },
  {
    id: "jordan",
    name: "Jordan",
    initials: "JO",
    color: "#FF85A2",
    avatarBg: "from-[#FF85A2] to-[#FFB3C6]",
  },
  {
    id: "sam",
    name: "Sam",
    initials: "SA",
    color: "#F59E0B",
    avatarBg: "from-[#F59E0B] to-[#FBBF24]",
  },
  {
    id: "jean",
    name: "Jean",
    initials: "JE",
    color: "#3B82F6",
    avatarBg: "from-[#3B82F6] to-[#60A5FA]",
  },
  {
    id: "you",
    name: "You",
    initials: "YO",
    color: "#10B981",
    avatarBg: "from-[#10B981] to-[#34D399]",
  },
];

// Mock translations with language info
interface TranslationData {
  text: string;
  language: string;
  languageCode: string;
  flag: string;
}

const translations: { [key: string]: TranslationData } = {
  // English to Chinese translations
  "So I've been thinking about switching to more sustainable clothing brands, but the prices are—": {
    text: "所以我一直在考虑改用更可持续的服装品牌，但价格——",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "Oh! Have you checked out charity shops? I got this jumper for like £8.": {
    text: "哦！你去过慈善商店吗？我这件毛衣只花了8英镑。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "Charity shops are brilliant! Plus you're keeping clothes out of landfill.": {
    text: "慈善商店太棒了！而且你还能防止衣服被填埋。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "Right! That's actually what I was going to say. The prices seem high initially, but fast fashion is literally destroying the planet.": {
    text: "对！这正是我想说的。价格起初看起来很高，但快时尚正在摧毁地球。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "I read that the fashion industry produces like 10% of global carbon emissions?": {
    text: "我读到时尚行业产生了大约10%的全球碳排放？",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "Yeah, and the water waste is insane. One cotton t-shirt uses 2,700 litres.": {
    text: "是的，而且水资源浪费很严重。一件棉T恤要用2700升水。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "That can't be right, surely?": {
    text: "这不可能是真的吧？",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "It is! I watched a documentary about it. The cotton growing process uses tonnes of water.": {
    text: "是真的！我看过相关纪录片。棉花种植过程需要大量的水。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "What was it called? I'd like to watch it.": {
    text: "它叫什么名字？我想看看。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "Um... The True Cost, I think? It's on Netflix.": {
    text: "嗯...《真实的代价》，我想？在Netflix上。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "We should all watch it together! Movie night at mine on Friday?": {
    text: "我们应该一起看！周五在我家看电影怎么样？",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "Yes! I'll bring snacks.": {
    text: "好啊！我会带零食。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "Wait, what time on Friday? I've got my shift at the library until seven.": {
    text: "等等，周五几点？我在图书馆的班要到七点。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  // French messages from Jean (reverse: French to English)
  "Excusez-moi, je peux me joindre à vous? J'adore parler de mode durable!": {
    text: "Excuse me, can I join you? I love talking about sustainable fashion!",
    language: "English",
    languageCode: "en",
    flag: "🇬🇧"
  },
  "En France, nous avons beaucoup de vide-dressings—comment dites-vous... wardrobe sales? C'est très populaire.": {
    text: "In France, we have lots of vide-dressings—how do you say... wardrobe sales? It's very popular.",
    language: "English",
    languageCode: "en",
    flag: "🇬🇧"
  },
};

interface ConversationModeProps {
  userName?: string;
  isGroupSession?: boolean;
  sessionParticipants?: Array<{ id: string; name: string; hasConsented: boolean }>;
  onLeaveSession?: () => void;
}

export function ConversationMode({ 
  userName = "The app user",
  isGroupSession = false,
  sessionParticipants = [],
  onLeaveSession
}: ConversationModeProps) {
  const [isListening, setIsListening] = useState(true);
  const [showCalibration, setShowCalibration] = useState(false);
  const [calibratedVoices, setCalibratedVoices] = useState<string[]>([]);
  const [noiseLevel, setNoiseLevel] = useState<"low" | "medium" | "high">("low"); // Environmental noise
  const [controlsDismissed, setControlsDismissed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Translation state
  const [translatingMessageId, setTranslatingMessageId] = useState<string | null>(null);
  const [pressingMessageId, setPressingMessageId] = useState<string | null>(null);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      speakerId: "alex",
      text: "So I've been thinking about switching to more sustainable clothing brands, but the prices are—",
      timestamp: new Date(Date.now() - 54000),
      isComplete: true,
      tone: "neutral",
      isInterrupted: true,
    },
    {
      id: "2",
      speakerId: "jordan",
      text: "Oh! Have you checked out charity shops? I got this jumper for like £8.",
      timestamp: new Date(Date.now() - 52000),
      isComplete: true,
      tone: "excited",
    },
    {
      id: "3",
      speakerId: "sam",
      text: "Charity shops are brilliant! Plus you're keeping clothes out of landfill.",
      timestamp: new Date(Date.now() - 49000),
      isComplete: true,
      tone: "excited",
      nonVerbal: "laughter",
    },
    {
      id: "4",
      speakerId: "alex",
      text: "Right! That's actually what I was going to say. The prices seem high initially, but fast fashion is literally destroying the planet.",
      timestamp: new Date(Date.now() - 45000),
      isComplete: true,
      tone: "neutral",
      resumesThreadId: "1",
    },
    {
      id: "5",
      speakerId: "you",
      text: "I read that the fashion industry produces like 10% of global carbon emissions?",
      timestamp: new Date(Date.now() - 41000),
      isComplete: true,
      tone: "neutral",
    },
    {
      id: "6",
      speakerId: "jordan",
      text: "Yeah, and the water waste is insane. One cotton t-shirt uses 2,700 litres.",
      timestamp: new Date(Date.now() - 37000),
      isComplete: true,
      tone: "raised",
    },
    {
      id: "7",
      speakerId: "sam",
      text: "That can't be right, surely?",
      timestamp: new Date(Date.now() - 34000),
      isComplete: true,
      tone: "neutral",
      nonVerbal: "sighs",
    },
    {
      id: "8",
      speakerId: "jordan",
      text: "It is! I watched a documentary about it. The cotton growing process uses tonnes of water.",
      timestamp: new Date(Date.now() - 30000),
      isComplete: true,
      tone: "frustrated",
    },
    {
      id: "9",
      speakerId: "you",
      text: "What was it called? I'd like to watch it.",
      timestamp: new Date(Date.now() - 26000),
      isComplete: true,
      tone: "neutral",
    },
    {
      id: "10",
      speakerId: "jordan",
      text: "Um... The True Cost, I think? It's on Netflix.",
      timestamp: new Date(Date.now() - 23000),
      isComplete: true,
      tone: "whispering",
    },
    {
      id: "11",
      speakerId: "alex",
      text: "We should all watch it together! Movie night at mine on Friday?",
      timestamp: new Date(Date.now() - 19000),
      isComplete: true,
      tone: "excited",
      nonVerbal: "laughter",
    },
    {
      id: "12",
      speakerId: "sam",
      text: "Yes! I'll bring snacks.",
      timestamp: new Date(Date.now() - 15000),
      isComplete: true,
      tone: "excited",
    },
    {
      id: "13",
      speakerId: "jean",
      text: "Excusez-moi, je peux me joindre à vous? J'adore parler de mode durable!",
      timestamp: new Date(Date.now() - 12000),
      isComplete: true,
      tone: "excited",
    },
    {
      id: "14",
      speakerId: "jean",
      text: "En France, nous avons beaucoup de vide-dressings—comment dites-vous... wardrobe sales? C'est très populaire.",
      timestamp: new Date(Date.now() - 9000),
      isComplete: true,
      tone: "neutral",
    },
    {
      id: "15",
      speakerId: "jordan",
      text: "Wait, what time on Friday? I've got my shift at the library until seven.",
      timestamp: new Date(Date.now() - 5000),
      isComplete: true,
      tone: "neutral",
    },
  ]);

  // Queue of upcoming messages to show one at a time - stable reference
  const [upcomingMessages] = useState<Message[]>([
    {
      id: "live-alex-1",
      speakerId: "alex",
      text: "Um, well, let me think... how about, uh, half past seven? That gives everyone time to—",
      timestamp: new Date(),
      isComplete: false,
      tone: "neutral",
      nonVerbal: "clears throat",
      isInterrupted: true,
    },
    {
      id: "live-you",
      speakerId: "you",
      text: "Oh! I can bring popcorn!",
      timestamp: new Date(),
      isComplete: false,
      tone: "excited",
    },
    {
      id: "live-alex-2",
      speakerId: "alex",
      text: "Perfect! As I was saying, half past seven works perfectly.",
      timestamp: new Date(),
      isComplete: false,
      tone: "neutral",
      resumesThreadId: "live-alex-1",
    },
    {
      id: "live-sam",
      speakerId: "sam",
      text: "Actually, can we make it eight? I've got a tutorial until 7:30.",
      timestamp: new Date(),
      isComplete: false,
      tone: "whispering",
      nonVerbal: "sighs",
    },
  ]);

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(1); // Start with first word visible

  // Simulate changing noise levels
  useEffect(() => {
    const noiseLevels: Array<"low" | "medium" | "high"> = ["low", "low", "medium", "low", "high", "medium", "low"];
    let index = 0;
    
    const interval = setInterval(() => {
      setNoiseLevel(noiseLevels[index % noiseLevels.length]);
      index++;
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  // Word-by-word transcription - one message at a time
  useEffect(() => {
    if (!isListening) return;
    if (currentMessageIndex >= upcomingMessages.length) return;

    const currentMessage = upcomingMessages[currentMessageIndex];
    const words = currentMessage.text.split(" ");

    // Check if message is complete
    if (currentWordIndex >= words.length) {
      // Batch all state updates together for smooth transition
      const nextIndex = currentMessageIndex + 1;
      setMessages(prev => [...prev, { ...currentMessage, isComplete: true, timestamp: new Date() }]);
      setCurrentMessageIndex(nextIndex);
      setCurrentWordIndex(1);
      return;
    }

    // Add next word
    const speeds: { [key: string]: number } = {
      "live-alex-1": 320,  // Slower with hesitation
      "live-you": 200,     // Faster when excited
      "live-alex-2": 280,
      "live-sam": 380,     // Slower when whispering
    };

    const speed = speeds[currentMessage.id] || 280;
    const timer = setTimeout(() => {
      setCurrentWordIndex(prev => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [currentWordIndex, currentMessageIndex, isListening, upcomingMessages]);

  // Auto-scroll to bottom when new messages arrive or during live transcription
  useEffect(() => {
    if (isListening && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, currentWordIndex, isListening]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const getCurrentWords = (text: string, wordCount: number) => {
    const words = text.split(" ");
    return words.slice(0, wordCount).join(" ");
  };

  const getSpeaker = (speakerId: string) => {
    return speakers.find(s => s.id === speakerId) || speakers[0];
  };

  const isConsecutiveMessage = (currentIndex: number) => {
    if (currentIndex === 0) return false;
    return messages[currentIndex].speakerId === messages[currentIndex - 1].speakerId;
  };

  const handleVoiceCalibrationComplete = (name: string) => {
    setCalibratedVoices([...calibratedVoices, name]);
    setShowCalibration(false);
  };

  const getToneIcon = (tone?: Tone) => {
    switch (tone) {
      case "excited": return "✨";
      case "whispering": return "🤫";
      case "raised": return "📢";
      case "laughing": return "😄";
      case "frustrated": return "😤";
      default: return null;
    }
  };

  const getToneLabel = (tone?: Tone) => {
    switch (tone) {
      case "excited": return "excited";
      case "whispering": return "whispering";
      case "raised": return "raised voice";
      case "laughing": return "laughing";
      case "frustrated": return "frustrated";
      default: return null;
    }
  };

  const getNonVerbalLabel = (nonVerbal?: NonVerbal) => {
    if (!nonVerbal) return null;
    return `[${nonVerbal}]`;
  };

  const handleCaptureMoment = () => {
    // Get the most recent complete message
    const recentMessage = messages[messages.length - 1];
    if (recentMessage && onCaptureMoment) {
      const speaker = getSpeaker(recentMessage.speakerId);
      onCaptureMoment(
        recentMessage.speakerId,
        speaker.name,
        speaker.initials,
        speaker.color,
        recentMessage.text
      );
      
      // Trigger animation
      setBookmarkAnimating(true);
      setTimeout(() => setBookmarkAnimating(false), 600);
    }
  };

  const getNoiseColor = () => {
    switch (noiseLevel) {
      case "low": return "bg-[#10B981]";
      case "medium": return "bg-[#F59E0B]";
      case "high": return "bg-[#FF3B30]";
    }
  };

  const getNoiseLabel = () => {
    switch (noiseLevel) {
      case "low": return "Clear audio";
      case "medium": return "Moderate background noise";
      case "high": return "High background noise - accuracy may be affected";
    }
  };

  // Translation handlers - now persistent toggle
  const handlePressStart = (messageId: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setPressingMessageId(messageId);
    
    pressTimerRef.current = setTimeout(() => {
      toggleTranslation(messageId);
      setPressingMessageId(null);
    }, 200); // 200ms hold to trigger translation - fast for immediate use
  };

  const handlePressEnd = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setPressingMessageId(null);
  };

  const handlePressCancel = () => {
    handlePressEnd();
  };

  const toggleTranslation = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message && translations[message.text]) {
      setTranslatingMessageId(translatingMessageId === messageId ? null : messageId);
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  };

  // For easier testing: double-click to translate
  const handleDoubleClick = (messageId: string) => {
    toggleTranslation(messageId);
  };

  // If calibration is active, show only the calibration view
  if (showCalibration) {
    return (
      <VoiceCalibration
        onClose={() => setShowCalibration(false)}
        onComplete={handleVoiceCalibrationComplete}
        deafUserName={userName}
      />
    );
  }

  // Current live message
  const currentLiveMessage = currentMessageIndex < upcomingMessages.length 
    ? upcomingMessages[currentMessageIndex] 
    : null;

  return (
    <View className="h-full flex flex-col bg-[#FFFBF5]">
      {/* Header - glassmorphic */}
      <View className="px-6 pt-2 pb-4 bg-white/60 backdrop-blur-xl border-b border-[#2A0098]/10">
        <View className="space-y-3 mb-3">
          {/* Mode Toggle - Full width, proper WCAG sizing */}
          <TabsList className="bg-white/40 backdrop-blur-sm rounded-xl p-1 border border-white/60 h-auto w-full grid grid-cols-2 gap-1">
            <TabsTrigger 
              value="conversation" 
              className="px-4 py-2.5 rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EC4899] data-[state=active]:to-[#F472B6] data-[state=active]:text-white data-[state=active]:shadow-sm text-[#EC4899] hover:bg-white/50 transition-all min-h-[44px]"
            >
              <Users className="w-4 h-4 mr-2" strokeWidth={2} aria-hidden="true" />
              <span>Conversation</Text>
            </TabsTrigger>
            <TabsTrigger 
              value="lecture" 
              className="px-4 py-2.5 rounded-lg data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#6B5CAC] data-[state=active]:to-[#8B7BC8] data-[state=active]:text-white data-[state=active]:shadow-sm text-[#6B5CAC] hover:bg-white/50 transition-all min-h-[44px]"
            >
              <BookOpen className="w-4 h-4 mr-2" strokeWidth={2} aria-hidden="true" />
              <span>Lecture</Text>
            </TabsTrigger>
          </TabsList>
          
          {/* Info & Controls Row */}
          <View className="flex items-center justify-between gap-3">
            <Text className="text-[#6B5CAC] flex-1">Live transcription</Text>
            <View className="flex gap-2 shrink-0">
              <TouchableOpacity 
                onPress={() => setShowCalibration(true)}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF85A2]/20 to-[#FFB3C6]/30 backdrop-blur-xl flex items-center justify-center border border-[#FF85A2]/30 shadow-md hover:from-[#FF85A2]/30 hover:to-[#FFB3C6]/40 focus:outline-none focus:ring-2 focus:ring-[#FF85A2] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] transition-all"
                aria-label="Add voice calibration"
              >
                <UserPlus className="w-5 h-5 text-[#FF85A2]" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Environmental Noise Warning */}
        <Animated.View
          layout
          className={`mb-3 px-3 py-2 rounded-xl backdrop-blur-sm border flex items-center gap-2 ${
            noiseLevel === "high" 
              ? "bg-[#FF3B30]/10 border-[#FF3B30]/30" 
              : noiseLevel === "medium"
              ? "bg-[#F59E0B]/10 border-[#F59E0B]/30"
              : "bg-[#10B981]/10 border-[#10B981]/30"
          }`}
        >
          {noiseLevel === "high" ? (
            <AlertTriangle className="w-4 h-4 text-[#FF3B30]" strokeWidth={2} />
          ) : noiseLevel === "medium" ? (
            <Volume2 className="w-4 h-4 text-[#F59E0B]" strokeWidth={2} />
          ) : (
            <VolumeX className="w-4 h-4 text-[#10B981]" strokeWidth={2} />
          )}
          <View className="flex-1">
            <Text className={`text-xs ${
              noiseLevel === "high" 
                ? "text-[#FF3B30]" 
                : noiseLevel === "medium"
                ? "text-[#F59E0B]"
                : "text-[#10B981]"
            }`} style={{ fontWeight: 600 }}>
              {getNoiseLabel()}
            </Text>
          </View>
          {/* Noise level meter */}
          <View className="flex gap-0.5">
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className={`w-1 rounded-full transition-all ${
                  (noiseLevel === "low" && bar <= 1) ||
                  (noiseLevel === "medium" && bar <= 2) ||
                  (noiseLevel === "high" && bar <= 4)
                    ? getNoiseColor()
                    : "bg-[#2A0098]/20"
                }`}
                style={{ height: `${bar * 4}px` }}
              />
            ))}
          </View>
        </Animated.View>
        
        {/* Active participants */}
        <View className="flex items-center gap-2">
          <View className="flex -space-x-2">
            {speakers.slice(0, 3).map((speaker) => (
              <Avatar key={speaker.id} className="w-6 h-6 border-2 border-white">
                <AvatarFallback className={`bg-gradient-to-br ${speaker.avatarBg} text-white text-xs`}>
                  {speaker.initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </View>
          <Text className="text-[#6B5CAC] text-sm">{speakers.length - 1} speakers</Text>
        </View>
      </View>

      {/* Messages */}
      <View 
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4 overscroll-contain"
        role="log"
        aria-live="polite"
        aria-label="Conversation transcript"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth'
        }}
      >
        {messages.map((message, index) => {
          const speaker = getSpeaker(message.speakerId);
          const isYou = message.speakerId === "you";
          const showAvatar = !isConsecutiveMessage(index);
          
          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isYou ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <View className="flex-shrink-0">
                {showAvatar ? (
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className={`bg-gradient-to-br ${speaker.avatarBg} text-white`}>
                      {speaker.initials}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <View className="w-10 h-10"></View>
                )}
              </View>

              {/* Message content */}
              <View className={`flex-1 max-w-[75%] ${isYou ? 'items-end' : 'items-start'} flex flex-col`}>
                {/* Speaker name and time */}
                {showAvatar && (
                  <View className={`flex items-center gap-2 mb-1 ${isYou ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Text className="text-[#2A0098] font-medium text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
                      {speaker.name}
                    </Text>
                    <Text className="text-[#6B5CAC] text-xs">{formatTime(message.timestamp)}</Text>
                  </View>
                )}
                
                {/* Context preservation - resuming interrupted thread */}
                {message.resumesThreadId && (
                  <View className={`flex items-center gap-1.5 mb-1 ${isYou ? 'flex-row-reverse' : 'flex-row'}`}>
                    <View className="flex gap-0.5">
                      <View className="w-1 h-1 rounded-full bg-[#6B5CAC]" aria-hidden="true"></View>
                      <View className="w-1 h-1 rounded-full bg-[#6B5CAC]" aria-hidden="true"></View>
                      <View className="w-1 h-1 rounded-full bg-[#6B5CAC]" aria-hidden="true"></View>
                    </View>
                    <Text className="text-[#6B5CAC] text-xs italic">back to previous topic</Text>
                  </View>
                )}
                
                {/* Message bubble */}
                <div
                  className={`rounded-3xl px-4 py-3 relative overflow-hidden transition-all ${
                    translatingMessageId === message.id
                      ? (translations[message.text]?.languageCode === 'en' 
                          ? 'bg-gradient-to-br from-[#3B82F6]/20 to-[#60A5FA]/20 backdrop-blur-xl border-2 border-[#3B82F6]/40'
                          : 'bg-gradient-to-br from-[#FF85A2]/20 to-[#FFB3C6]/20 backdrop-blur-xl border-2 border-[#FF85A2]/40')
                      : isYou
                      ? 'bg-gradient-to-br from-[#10B981] to-[#34D399] text-white rounded-tr-md'
                      : 'bg-white/70 backdrop-blur-sm text-[#2A0098] border border-white/60 shadow-sm rounded-tl-md'
                  } ${message.isInterrupted && translatingMessageId !== message.id ? 'border-r-4 border-r-[#F59E0B]/40' : ''} ${
                    pressingMessageId === message.id ? 'scale-[0.98] shadow-lg' : ''
                  }`}
                  role="article"
                  aria-label={`${speaker.name}: ${message.text}`}
                  onMouseDown={(e) => handlePressStart(message.id, e)}
                  onMouseUp={handlePressEnd}
                  onMouseLeave={handlePressCancel}
                  onTouchStart={(e) => handlePressStart(message.id, e)}
                  onTouchEnd={handlePressEnd}
                  onTouchCancel={handlePressCancel}
                  onDoubleClick={() => handleDoubleClick(message.id)}
                  style={{ cursor: translations[message.text] ? 'pointer' : 'default' }}
                >
                  {/* Tone indicator */}
                  {message.tone && message.tone !== "neutral" && (
                    <View className={`flex items-center gap-1 mb-1 text-xs ${isYou ? 'text-white/80' : 'text-[#6B5CAC]'}`}>
                      <span>{getToneIcon(message.tone)}</Text>
                      <Text className="italic">{getToneLabel(message.tone)}</Text>
                    </View>
                  )}
                  
                  <Text className="leading-relaxed text-sm">
                    {message.text}
                  </Text>
                  
                  {/* Non-verbal sounds */}
                  {message.nonVerbal && (
                    <Text className={`text-xs mt-1 italic ${isYou ? 'text-white/70' : 'text-[#6B5CAC]'}`}>
                      {getNonVerbalLabel(message.nonVerbal)}
                    </Text>
                  )}
                  
                  {/* Interrupted indicator */}
                  {message.isInterrupted && (
                    <View className={`mt-1 text-xs italic ${isYou ? 'text-white/70' : 'text-[#F59E0B]'}`}>
                      interrupted...
                    </View>
                  )}

                  {/* Press progress indicator */}
                  {/* AnimatePresence - replace with conditional render */
                    {pressingMessageId === message.id && (
                      <Animated.View
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        transition={{ duration: 0.2, ease: "linear" }}
                        className={`absolute bottom-0 left-0 right-0 h-1 origin-left ${
                          isYou ? 'bg-white/40' : 'bg-[#FF85A2]/40'
                        }`}
                        style={{ borderRadius: '0 0 24px 24px' }}
                      />
                    )}
                  

                  {/* Translation overlay - now persistent */}
                  {/* AnimatePresence - replace with conditional render */
                    {translatingMessageId === message.id && translations[message.text] && (
                      <Animated.View
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '100%', opacity: 0 }}
                        transition={{ 
                          type: "spring", 
                          damping: 25, 
                          stiffness: 300,
                          opacity: { duration: 0.2 }
                        }}
                        className="relative"
                      >
                        {/* Language swap indicator */}
                        <View className="flex items-center justify-between mb-2">
                          <View className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs ${
                            translations[message.text].languageCode === 'en'
                              ? 'bg-[#3B82F6]/20 text-[#3B82F6]'
                              : 'bg-[#FF85A2]/20 text-[#FF85A2]'
                          }`} style={{ fontWeight: 600 }}>
                            <span>
                              {translations[message.text].languageCode === 'en' ? '🇫🇷' : '🇬🇧'}
                            </Text>
                            <Text className="text-[#2A0098]/40">→</Text>
                            <span>{translations[message.text].flag}</Text>
                            <Text className="ml-1">{translations[message.text].language}</Text>
                          </View>
                          <button
                            onPress={() => setTranslatingMessageId(null)}
                            className="w-5 h-5 rounded-full bg-[#2A0098]/10 hover:bg-[#2A0098]/20 flex items-center justify-center transition-colors"
                            aria-label="Hide translation"
                          >
                            <X className="w-3 h-3 text-[#2A0098]" strokeWidth={2.5} />
                          </TouchableOpacity>
                        </View>
                        
                        {/* Translated text */}
                        <Text className="leading-relaxed text-sm text-[#2A0098]" style={{ fontWeight: 500 }}>
                          {translations[message.text].text}
                        </Text>

                        {/* Divider */}
                        <View className="my-2 border-t border-[#2A0098]/10"></View>

                        {/* Original text (dimmed) */}
                        <Text className="leading-relaxed text-sm text-[#2A0098]/50 italic">
                          {message.text}
                        </Text>
                      </Animated.View>
                    )}
                  
                </View>
              </View>
            </View>
          );
        })}
        
        {/* Current live message */}
        {isListening && currentLiveMessage && (
          <View className={`flex gap-3 ${currentLiveMessage.speakerId === "you" ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar with pulse */}
            <View className="flex-shrink-0 relative">
              <Avatar className="w-10 h-10">
                <AvatarFallback className={`bg-gradient-to-br ${getSpeaker(currentLiveMessage.speakerId).avatarBg} text-white`}>
                  {getSpeaker(currentLiveMessage.speakerId).initials}
                </AvatarFallback>
              </Avatar>
              <View className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#10B981] rounded-full border-2 border-[#FFFBF5]" />
            </View>

            {/* Live message content */}
            <View className={`flex-1 max-w-[75%] ${currentLiveMessage.speakerId === "you" ? 'items-end' : 'items-start'} flex flex-col`}>
              {/* Speaker name with "speaking now" */}
              <View className={`flex items-center gap-2 mb-1 ${currentLiveMessage.speakerId === "you" ? 'flex-row-reverse' : 'flex-row'}`}>
                <Text className="text-[#2A0098] font-medium text-sm">
                  {getSpeaker(currentLiveMessage.speakerId).name}
                </Text>
                <Text 
                  className="text-[#10B981] text-xs flex items-center gap-1"
                  role="status"
                  aria-live="polite"
                >
                  <Text className="w-1.5 h-1.5 bg-[#10B981] rounded-full" aria-hidden="true"></Text>
                  speaking now
                </Text>
              </View>
              
              {/* Context preservation indicator */}
              {currentLiveMessage.resumesThreadId && (
                <View className={`flex items-center gap-1.5 mb-1 ${currentLiveMessage.speakerId === "you" ? 'flex-row-reverse' : 'flex-row'}`}>
                  <View className="flex gap-0.5">
                    <View className="w-1 h-1 rounded-full bg-[#6B5CAC]" aria-hidden="true"></View>
                    <View className="w-1 h-1 rounded-full bg-[#6B5CAC]" aria-hidden="true"></View>
                    <View className="w-1 h-1 rounded-full bg-[#6B5CAC]" aria-hidden="true"></View>
                  </View>
                  <Text className="text-[#6B5CAC] text-xs italic">back to previous topic</Text>
                </View>
              )}
              
              {/* Live bubble */}
              <View 
                className={`rounded-3xl px-4 py-3 relative ${
                  currentLiveMessage.speakerId === "you"
                    ? 'bg-gradient-to-br from-[#10B981] to-[#34D399] text-white border border-[#10B981]/40 rounded-tr-md'
                    : 'bg-white/70 backdrop-blur-sm text-[#2A0098] border border-[#10B981]/40 shadow-sm rounded-tl-md'
                } ${currentLiveMessage.isInterrupted ? 'border-r-4 border-r-[#F59E0B]/40' : ''}`}
                role="article"
                aria-live="polite"
                aria-atomic="false"
                aria-label={`${getSpeaker(currentLiveMessage.speakerId).name} speaking`}
              >
                {/* Tone indicator for live messages */}
                {currentLiveMessage.tone && currentLiveMessage.tone !== "neutral" && (
                  <View className={`flex items-center gap-1 mb-1 text-xs ${currentLiveMessage.speakerId === "you" ? 'text-white/80' : 'text-[#6B5CAC]'}`}>
                    <span>{getToneIcon(currentLiveMessage.tone)}</Text>
                    <Text className="italic">{getToneLabel(currentLiveMessage.tone)}</Text>
                  </View>
                )}
                
                {/* Non-verbal sounds in live messages */}
                {currentLiveMessage.nonVerbal && (
                  <Text className={`text-xs mb-1 italic ${currentLiveMessage.speakerId === "you" ? 'text-white/70' : 'text-[#6B5CAC]'}`}>
                    {getNonVerbalLabel(currentLiveMessage.nonVerbal)}
                  </Text>
                )}
                
                <Text className="leading-relaxed text-sm">
                  {getCurrentWords(currentLiveMessage.text, currentWordIndex)}
                  <span
                    className={`inline-block w-0.5 h-4 ${currentWordIndex > 0 ? 'ml-1' : ''} ${currentLiveMessage.speakerId === "you" ? 'bg-white' : 'bg-[#10B981]'}`}
                    aria-hidden="true"
                  />
                </Text>
                
                {/* Interrupted indicator for live messages */}
                {currentLiveMessage.isInterrupted && currentWordIndex >= currentLiveMessage.text.split(" ").length && (
                  <View className={`mt-1 text-xs italic ${currentLiveMessage.speakerId === "you" ? 'text-white/70' : 'text-[#F59E0B]'}`}>
                    interrupted...
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
        
        {/* Listening indicator when idle */}
        {isListening && !currentLiveMessage && (
          <Animated.View
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 py-4"
          >
            <Animated.View
              className="w-2 h-2 rounded-full bg-[#10B981]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <Text className="text-[#6B5CAC] text-sm">Listening for speech...</Text>
          </Animated.View>
        )}
        
        {/* Invisible element for auto-scrolling */}
        <View ref={messagesEndRef} />
      </View>

      {/* Control bar - glassmorphic */}
      {!controlsDismissed && (
        <View className="px-6 py-5 bg-white/60 backdrop-blur-xl border-t border-[#2A0098]/10 relative">
          {/* Close button */}
          <button
            onPress={() => setControlsDismissed(true)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm border border-[#2A0098]/10 flex items-center justify-center hover:bg-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#2A0098] focus:ring-offset-2 focus:ring-offset-white/60 transition-all shadow-sm z-20"
            aria-label="Dismiss controls"
          >
            <X className="w-4 h-4 text-[#2A0098]" strokeWidth={2.5} aria-hidden="true" />
          </TouchableOpacity>

          <button
            onPress={() => setIsListening(!isListening)}
            className={`w-full py-4 rounded-3xl flex items-center justify-center gap-3 shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] transition-all ${
              isListening
                ? "bg-gradient-to-r from-[#FF85A2] to-[#FFB3C6]"
                : "bg-gradient-to-r from-[#10B981] to-[#34D399]"
            }`}
            aria-label={isListening ? "Stop listening to conversation" : "Start listening to conversation"}
            aria-pressed={isListening}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 text-white" strokeWidth={2.5} aria-hidden="true" />
                <Text className="text-white font-medium">Stop Listening</Text>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 text-white" strokeWidth={2.5} aria-hidden="true" />
                <Text className="text-white font-medium">Start Listening</Text>
              </>
            )}
          </TouchableOpacity>
          
          <View className="mt-3 space-y-1">
            <Text className="text-center text-[#6B5CAC] text-xs">
              Conversations are processed locally and can be saved for later reference
            </Text>
            <Text className="text-center text-[#FF85A2] text-xs">
              💡 Press & hold (or double-click) to toggle translation • Tap ✕ to hide
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
