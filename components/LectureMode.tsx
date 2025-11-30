import { View, Text } from 'react-native';
import { motion, AnimatePresence } from "react-native-reanimated";
import { Mic, MicOff, BookOpen, Pause, Play, Clock, CheckCircle2, Users, Bluetooth, Bookmark, Sparkles, X } from "lucide-react-native";
import { useState, useEffect, useRef } from "react";
import { Badge } from "./ui/badge";
import { TabsList, TabsTrigger } from "./ui/tabs";

interface JargonTerm {
  term: string;
  definition: string;
  highlighted: boolean;
}

interface TranscriptSegment {
  id: string;
  text: string;
  timestamp: Date;
  isComplete: boolean;
  highlightedTerms: string[];
}

interface TranslationData {
  text: string;
  language: string;
  languageCode: string;
  flag: string;
}

// Sample translations for lecture content - ALL segments
const lectureTranslations: { [key: string]: TranslationData } = {
  "Right, good morning everyone. So, today we're going to be looking at the small intestine.": {
    text: "好的，大家早上好。今天我们要学习小肠。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "Now, the small intestine... it's about 6 to 7 metres long, which is quite remarkable really.": {
    text: "小肠大约有6到7米长，这真的很了不起。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "And it's divided into three sections - the duodenum, the jejunum, and the ileum.": {
    text: "它分为三个部分 - 十二指肠、空肠和回肠。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "Let's start with the duodenum, shall we? This is where chyme enters from the stomach.": {
    text: "让我们从十二指肠开始，好吗？这是食糜从胃进入的地方。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "The chyme passes through the pyloric sphincter... and it's quite acidic at this point.": {
    text: "食糜通过幽门括约肌...此时它是相当酸性的。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "So the duodenum secretes bicarbonate to neutralise that acidity. This creates the right pH for digestion.": {
    text: "因此十二指肠分泌碳酸氢盐来中和这种酸性。这创造了消化所需的正确pH值。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "Now, moving on to the jejunum. This is really where most of the absorption happens.": {
    text: "现在，我们来看空肠。这里是大部分吸收发生的地方。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "The intestinal wall here is folded into these tiny structures called villi.": {
    text: "这里的肠壁折叠成被称为绒毛的微小结构。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "Each villus - and there are millions of them - is covered with cells called enterocytes.": {
    text: "每个绒毛 - 有数百万个 - 都覆盖着称为肠细胞的细胞。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "These enterocytes have even tinier projections called microvilli. Together they form what we call the brush border.": {
    text: "这些肠细胞有更小的突起，称为微绒毛。它们一起形成我们所说的刷状缘。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "And this dramatically increases the surface area for absorption... we're talking about 200 square metres.": {
    text: "这大大增加了吸收的表面积...我们说的是200平方米。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "To put that in perspective, that's roughly the size of a tennis court.": {
    text: "换个角度来看，这大约是一个网球场的大小。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "Within each villus, you'll find capillaries and a central lacteal.": {
    text: "在每个绒毛内，你会发现毛细血管和一个中央乳糜管。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "The lacteal is particularly important because it absorbs fats and fat-soluble vitamins.": {
    text: "乳糜管特别重要，因为它吸收脂肪和脂溶性维生素。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "Now, peristalsis - these are rhythmic muscle contractions - moves the chyme through the intestine.": {
    text: "现在，蠕动 - 这些是有节奏的肌肉收缩 - 将食糜推动通过肠道。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "It happens quite slowly, about 1 centimetre per minute.": {
    text: "它发生得很慢，大约每分钟1厘米。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "Throughout the epithelium, we also have goblet cells. These secrete mucus.": {
    text: "在整个上皮中，我们还有杯状细胞。这些分泌粘液。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "And finally, the ileum. This last section absorbs vitamin B12 and bile salts.": {
    text: "最后是回肠。这最后一部分吸收维生素B12和胆盐。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "The bile salts are recycled through what we call enterohepatic circulation.": {
    text: "胆盐通过我们所说的肠肝循环被回收利用。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
  "The whole journey from ingestion to the large intestine takes about 3 to 5 hours.": {
    text: "从摄入到大肠的整个过程大约需要3到5小时。",
    language: "Chinese",
    languageCode: "zh",
    flag: "🇨🇳"
  },
};

const digestiveJargon: JargonTerm[] = [
  { term: "peristalsis", definition: "Wave-like muscle contractions that move food through the digestive tract", highlighted: false },
  { term: "villi", definition: "Tiny finger-like projections in the small intestine that increase surface area for absorption", highlighted: false },
  { term: "microvilli", definition: "Microscopic projections on epithelial cells forming the brush border", highlighted: false },
  { term: "chyme", definition: "Semi-fluid mass of partly digested food expelled from the stomach", highlighted: false },
  { term: "duodenum", definition: "The first section of the small intestine, approximately 25-30cm long", highlighted: false },
  { term: "jejunum", definition: "The middle section of the small intestine, primarily responsible for nutrient absorption", highlighted: false },
  { term: "ileum", definition: "The final section of the small intestine, connecting to the large intestine", highlighted: false },
  { term: "enterocytes", definition: "Absorptive cells lining the small intestine epithelium", highlighted: false },
  { term: "lacteal", definition: "Lymphatic capillary in intestinal villi that absorbs dietary fats", highlighted: false },
  { term: "goblet cells", definition: "Specialized epithelial cells that secrete mucus", highlighted: false },
];

const lectureSampleText = [
  "Right, good morning everyone. So, today we're going to be looking at the small intestine.",
  "Now, the small intestine... it's about 6 to 7 metres long, which is quite remarkable really.",
  "And it's divided into three sections - the duodenum, the jejunum, and the ileum.",
  "Let's start with the duodenum, shall we? This is where chyme enters from the stomach.",
  "The chyme passes through the pyloric sphincter... and it's quite acidic at this point.",
  "So the duodenum secretes bicarbonate to neutralise that acidity. This creates the right pH for digestion.",
  "Now, moving on to the jejunum. This is really where most of the absorption happens.",
  "The intestinal wall here is folded into these tiny structures called villi.",
  "Each villus - and there are millions of them - is covered with cells called enterocytes.",
  "These enterocytes have even tinier projections called microvilli. Together they form what we call the brush border.",
  "And this dramatically increases the surface area for absorption... we're talking about 200 square metres.",
  "To put that in perspective, that's roughly the size of a tennis court.",
  "Within each villus, you'll find capillaries and a central lacteal.",
  "The lacteal is particularly important because it absorbs fats and fat-soluble vitamins.",
  "Now, peristalsis - these are rhythmic muscle contractions - moves the chyme through the intestine.",
  "It happens quite slowly, about 1 centimetre per minute.",
  "Throughout the epithelium, we also have goblet cells. These secrete mucus.",
  "And finally, the ileum. This last section absorbs vitamin B12 and bile salts.",
  "The bile salts are recycled through what we call enterohepatic circulation.",
  "The whole journey from ingestion to the large intestine takes about 3 to 5 hours.",
];

interface LectureModeProps {
  userName?: string;
  onCaptureMoment?: (speakerId: string, speakerName: string, speakerInitials: string, speakerColor: string, text: string) => void;
  onViewMyMoments?: () => void;
  momentCount?: number;
}

export function LectureMode({ userName = "Student", onCaptureMoment, onViewMyMoments, momentCount = 0 }: LectureModeProps) {
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[]>([]);
  const [currentLiveText, setCurrentLiveText] = useState("");
  const [highlightedJargon, setHighlightedJargon] = useState<JargonTerm[]>(digestiveJargon);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [vocabLoaded, setVocabLoaded] = useState(false);
  const [bookmarkAnimating, setBookmarkAnimating] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Translation state
  const [translatingSegmentId, setTranslatingSegmentId] = useState<string | null>(null);
  const [pressingSegmentId, setPressingSegmentId] = useState<string | null>(null);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom when new segments are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [transcriptSegments, currentLiveText]);

  // Timer for elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isListening && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isListening, isPaused]);

  // Simulate lecture transcription
  useEffect(() => {
    if (!isListening || isPaused || currentSegmentIndex >= lectureSampleText.length) {
      return;
    }

    const currentText = lectureSampleText[currentSegmentIndex];
    const words = currentText.split(" ");
    let wordIndex = 0;

    const interval = setInterval(() => {
      if (wordIndex < words.length) {
        const word = words[wordIndex];
        setCurrentLiveText(prev => (prev ? prev + " " + word : word));
        
        // Check if word matches any jargon term
        const matchedTerm = digestiveJargon.find(j => 
          word.toLowerCase().includes(j.term.toLowerCase())
        );
        
        if (matchedTerm) {
          setHighlightedJargon(prev => 
            prev.map(j => j.term === matchedTerm.term ? { ...j, highlighted: true } : j)
          );
        }
        
        wordIndex++;
      } else {
        // Segment complete
        const highlightedTerms = digestiveJargon
          .filter(j => currentText.toLowerCase().includes(j.term.toLowerCase()))
          .map(j => j.term);

        setTranscriptSegments(prev => [
          ...prev,
          {
            id: `segment-${currentSegmentIndex}`,
            text: currentText,
            timestamp: new Date(),
            isComplete: true,
            highlightedTerms,
          },
        ]);
        
        setCurrentLiveText("");
        setCurrentSegmentIndex(prev => prev + 1);
        clearInterval(interval);
      }
    }, 286); // ~286ms per word for realistic lecture pace (~210 wpm)

    return () => clearInterval(interval);
  }, [isListening, isPaused, currentSegmentIndex]);

  const toggleListening = () => {
    if (!isListening) {
      setIsListening(true);
      setIsPaused(false);
    } else {
      setIsListening(false);
      setIsPaused(false);
      setCurrentSegmentIndex(0);
      setTranscriptSegments([]);
      setCurrentLiveText("");
      setElapsedTime(0);
      setHighlightedJargon(digestiveJargon.map(j => ({ ...j, highlighted: false })));
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Translation handlers
  const handlePressStart = (segmentId: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setPressingSegmentId(segmentId);
    
    pressTimerRef.current = setTimeout(() => {
      toggleTranslation(segmentId);
      setPressingSegmentId(null);
    }, 200); // 200ms - fast for immediate use
  };

  const handlePressEnd = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setPressingSegmentId(null);
  };

  const handlePressCancel = () => {
    handlePressEnd();
  };

  const toggleTranslation = (segmentId: string) => {
    const segment = transcriptSegments.find(s => s.id === segmentId);
    if (segment && lectureTranslations[segment.text]) {
      setTranslatingSegmentId(translatingSegmentId === segmentId ? null : segmentId);
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  };

  const handleDoubleClick = (segmentId: string) => {
    toggleTranslation(segmentId);
  };

  const highlightJargonInText = (text: string, highlightedTerms: string[]) => {
    if (highlightedTerms.length === 0) return text;

    let highlightedText = text;
    highlightedTerms.forEach(term => {
      const regex = new RegExp(`\\b(${term})\\b`, 'gi');
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="bg-[#FF85A2]/20 text-[#2A0098] px-1 rounded">$1</mark>'
      );
    });
    return highlightedText;
  };

  const handleCaptureMoment = () => {
    // Get the most recent complete segment
    const recentSegment = transcriptSegments[transcriptSegments.length - 1];
    if (recentSegment && onCaptureMoment) {
      onCaptureMoment(
        "lecturer",
        "Dr. Sarah Mitchell",
        "SM",
        "#6B5CAC",
        recentSegment.text
      );
      
      // Trigger animation
      setBookmarkAnimating(true);
      setTimeout(() => setBookmarkAnimating(false), 600);
    }
  };

  return (
    <View className="h-full flex flex-col bg-gradient-to-b from-[#FFFBF5] to-[#FFF8EF]">
      {/* Header */}
      <View className="px-6 pt-2 pb-4">
        <Animated.View
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl p-4 border border-white/80 shadow-lg"
        >
          <View className="space-y-3">
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

            {/* Lecture Info & Controls Row */}
            <View className="flex items-center justify-between gap-3">
              <View className="flex items-center gap-3 flex-1 min-w-0">
                <View className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6B5CAC] to-[#8B7BC8] flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-white" strokeWidth={2} aria-hidden="true" />
                </View>
                <View className="flex-1 min-w-0">
                  <Text className="text-[#2A0098] truncate">Human Biology</Text>
                  <Text className="text-[#6B5CAC] text-sm truncate">Dr. Sarah Mitchell</Text>
                </View>
              </View>
              <button
                onPress={toggleListening}
                className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-white/60 ${
                  isListening
                    ? "bg-gradient-to-br from-[#6366F1] to-[#818CF8] hover:scale-105 shadow-lg"
                    : "bg-gradient-to-br from-[#6B5CAC] to-[#8B7BC8] hover:scale-105 shadow-lg hover:from-[#7B6BBC] hover:to-[#9B8BD8]"
                }`}
                aria-label={isListening ? "Stop lecture transcription" : "Start lecture transcription"}
              >
                {isListening ? (
                  <MicOff className="w-6 h-6 text-white" strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Mic className="w-6 h-6 text-white" strokeWidth={2} aria-hidden="true" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Bluetooth Connection Indicator */}
          {isListening && (
            <Animated.View
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/30"
            >
              <View className="relative">
                <Bluetooth className="w-4 h-4 text-[#3B82F6]" strokeWidth={2} aria-hidden="true" />
                <Animated.View
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#10B981]"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  aria-hidden="true"
                />
              </View>
              <Text className="text-[#3B82F6] text-sm">Lecture mic connected</Text>
            </Animated.View>
          )}

          {/* Controls & Stats */}
          {isListening && (
            <View className="flex items-center justify-between pt-3 border-t border-white/40 mt-3">
              <View className="flex items-center gap-4">
                <button
                  onPress={togglePause}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 border border-white/60 text-[#6B5CAC] hover:bg-white/80 transition-all focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-white/60"
                  aria-label={isPaused ? "Resume transcription" : "Pause transcription"}
                >
                  {isPaused ? (
                    <Play className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                  ) : (
                    <Pause className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                  )}
                  <Text className="text-sm">{isPaused ? "Resume" : "Pause"}</Text>
                </TouchableOpacity>

                <View className="flex items-center gap-1.5 text-[#6B5CAC] text-sm">
                  <Clock className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                  <span>{formatTime(elapsedTime)}</Text>
                </View>
              </View>

              {momentCount > 0 && (
                <button
                  onPress={onViewMyMoments}
                  className="relative px-2.5 py-2 rounded-xl bg-[#2A0098]/90 backdrop-blur-xl border border-white/40 text-white hover:shadow-lg hover:scale-105 hover:bg-[#2A0098] transition-all focus:outline-none focus:ring-2 focus:ring-[#2A0098] focus:ring-offset-2 focus:ring-offset-white/60 flex items-center gap-1.5 shadow-md overflow-hidden group"
                  aria-label={`View ${momentCount} captured moments`}
                >
                  <Text className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" aria-hidden="true"></Text>
                  <Sparkles className="w-4 h-4 text-white relative z-10" strokeWidth={2.5} aria-hidden="true" />
                  <Text className="text-sm relative z-10">{momentCount}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </Animated.View>

        {/* Vocabulary Panel */}
        {!vocabLoaded && !isListening ? (
          <Animated.View
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/80"
          >
            <View className="flex items-center justify-between mb-3">
              <View className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#6B5CAC]" strokeWidth={2} aria-hidden="true" />
                <Text className="text-[#2A0098] text-sm">Subject vocabulary</Text>
              </View>
              <button
                onPress={() => setVocabLoaded(true)}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-[#6B5CAC] to-[#8B7BC8] text-white hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-white/60"
                aria-label="Load vocabulary for this lecture"
              >
                Load vocab
              </TouchableOpacity>
            </View>
            <Text className="text-[#6B5CAC] text-sm">
              Load subject-specific terms to automatically highlight them during the lecture
            </Text>
          </Animated.View>
        ) : vocabLoaded && (
          <Animated.View
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 bg-[#D8FDCC]/20 backdrop-blur-sm rounded-2xl p-4 border border-[#D8FDCC]/40"
          >
            <View className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" strokeWidth={2} aria-hidden="true" />
              <Text className="text-[#2A0098] text-sm">Pre-loaded vocabulary</Text>
            </View>
            <View className="flex flex-wrap gap-2">
              {highlightedJargon.map((jargon) => (
                <Badge
                  key={jargon.term}
                  className={`${
                    jargon.highlighted
                      ? "bg-[#FF85A2]/30 text-[#2A0098] border-[#FF85A2]/50"
                      : "bg-white/60 text-[#6B5CAC] border-white/60"
                  } transition-all`}
                >
                  {jargon.term}
                </Badge>
              ))}
            </View>
          </Animated.View>
        )}
      </View>

      {/* Transcript Area */}
      <View className="flex-1 overflow-hidden px-6 pb-6 relative">
        {/* Floating Bookmark Button */}
        {isListening && transcriptSegments.length > 0 && (
          <Animated.View
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onPress={handleCaptureMoment}
            className="absolute bottom-6 right-6 z-10 w-14 h-14 rounded-full bg-gradient-to-br from-[#6B5CAC] to-[#8B7BC8] shadow-lg flex items-center justify-center hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] transition-all active:scale-95"
            whileTap={{ scale: 0.9 }}
            aria-label="Capture this moment"
          >
            <Animated.View
              animate={bookmarkAnimating ? {
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0],
              } : {}}
              transition={{ duration: 0.6 }}
            >
              <Bookmark 
                className={`w-6 h-6 text-white ${bookmarkAnimating ? 'fill-white' : ''}`} 
                strokeWidth={2} 
                aria-hidden="true" 
              />
            </Animated.View>
          </Animated.View>
        )}
        
        <div
          ref={scrollAreaRef}
          className="h-full overflow-y-auto bg-white/40 backdrop-blur-sm rounded-3xl p-6 border border-white/60 overscroll-contain"
          role="log"
          aria-live="polite"
          aria-label="Lecture transcript"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth'
          }}
        >
          {!isListening && transcriptSegments.length === 0 ? (
            <View className="h-full flex flex-col items-center justify-center text-center">
              <View className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6B5CAC]/20 to-[#8B7BC8]/10 flex items-center justify-center mb-4">
                <Mic className="w-10 h-10 text-[#6B5CAC]" strokeWidth={2} aria-hidden="true" />
              </View>
              <Text className="text-[#2A0098] mb-2">Ready to capture your lecture</Text>
              <Text className="text-[#6B5CAC] text-sm max-w-xs">
                Tap the microphone to start transcribing. Pre-loaded vocabulary will be automatically highlighted.
              </Text>
            </View>
          ) : (
            <View className="space-y-4">
              {/* Completed Segments */}
              {transcriptSegments.map((segment) => (
                <div
                  key={segment.id}
                  className={`rounded-2xl p-4 border transition-all ${
                    translatingSegmentId === segment.id
                      ? 'bg-gradient-to-br from-[#FF85A2]/20 to-[#FFB3C6]/20 backdrop-blur-xl border-2 border-[#FF85A2]/40'
                      : 'bg-white/60 border-white/60'
                  } ${
                    pressingSegmentId === segment.id ? 'scale-[0.98] shadow-lg' : ''
                  }`}
                  onMouseDown={(e) => handlePressStart(segment.id, e)}
                  onMouseUp={handlePressEnd}
                  onMouseLeave={handlePressCancel}
                  onTouchStart={(e) => handlePressStart(segment.id, e)}
                  onTouchEnd={handlePressEnd}
                  onTouchCancel={handlePressCancel}
                  onDoubleClick={() => handleDoubleClick(segment.id)}
                  style={{ cursor: lectureTranslations[segment.text] ? 'pointer' : 'default' }}
                >
                  {/* Press progress indicator */}
                  {/* AnimatePresence - replace with conditional render */
                    {pressingSegmentId === segment.id && (
                      <Animated.View
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        transition={{ duration: 0.2, ease: "linear" }}
                        className="absolute bottom-0 left-0 right-0 h-1 origin-left bg-[#FF85A2]/40"
                        style={{ borderRadius: '0 0 16px 16px' }}
                      />
                    )}
                  

                  {/* Translation overlay */}
                  {/* AnimatePresence - replace with conditional render */
                    {translatingSegmentId === segment.id && lectureTranslations[segment.text] && (
                      <Animated.View
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mb-3"
                      >
                        <View className="flex items-center justify-between mb-2">
                          <View className="flex items-center gap-2 px-2.5 py-1 rounded-full text-xs bg-[#FF85A2]/20 text-[#FF85A2]" style={{ fontWeight: 600 }}>
                            <span>🇬🇧</Text>
                            <Text className="text-[#2A0098]/40">→</Text>
                            <span>{lectureTranslations[segment.text].flag}</Text>
                            <Text className="ml-1">{lectureTranslations[segment.text].language}</Text>
                          </View>
                          <button
                            onPress={() => setTranslatingSegmentId(null)}
                            className="w-5 h-5 rounded-full bg-[#2A0098]/10 hover:bg-[#2A0098]/20 flex items-center justify-center transition-colors"
                            aria-label="Hide translation"
                          >
                            <X className="w-3 h-3 text-[#2A0098]" strokeWidth={2.5} />
                          </TouchableOpacity>
                        </View>
                        <Text className="leading-relaxed text-sm text-[#2A0098] mb-2" style={{ fontWeight: 500 }}>
                          {lectureTranslations[segment.text].text}
                        </Text>
                        <View className="border-t border-[#2A0098]/10 pt-2"></View>
                      </Animated.View>
                    )}
                  

                  {/* Original text */}
                  <p
                    className={`leading-relaxed ${
                      translatingSegmentId === segment.id ? 'text-[#2A0098]/50 italic text-sm' : 'text-[#2A0098]'
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: highlightJargonInText(segment.text, segment.highlightedTerms),
                    }}
                  />
                </View>
              ))}

              {/* Current Live Segment */}
              {currentLiveText && (
                <View className="bg-gradient-to-br from-[#FF85A2]/10 to-[#FFB3C6]/5 rounded-2xl p-4 border-2 border-[#FF85A2]/30">
                  <View className="flex items-start gap-3">
                    <View className="flex items-center gap-2 mt-1">
                      <Animated.View
                        className="w-2 h-2 rounded-full bg-[#FF85A2]"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        aria-hidden="true"
                      />
                      <Text className="text-[#FF85A2] text-xs uppercase tracking-wide" style={{ fontWeight: 600 }}>
                        Live
                      </Text>
                    </View>
                  </View>
                  <Text className="text-[#2A0098] leading-relaxed mt-2">
                    {currentLiveText}
                    <Animated.View
                      className="inline-block w-0.5 h-5 bg-[#FF85A2] ml-1"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      aria-hidden="true"
                    />
                  </Text>
                </View>
              )}

              {isPaused && (
                <View className="bg-[#6B5CAC]/10 rounded-2xl p-4 border border-[#6B5CAC]/30 text-center">
                  <Text className="text-[#6B5CAC] text-sm">Transcription paused</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
