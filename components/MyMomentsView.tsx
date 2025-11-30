import { View, Text } from 'react-native';
import { motion, AnimatePresence } from "react-native-reanimated";
import { ArrowLeft, Sparkles, Check, Search, X } from "lucide-react-native";
import { useState, useRef } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface TranslationData {
  text: string;
  language: string;
  languageCode: string;
  flag: string;
}

// Translation dictionary - reuse from ConversationMode
const momentTranslations: { [key: string]: TranslationData } = {
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
  // Lecture content
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
};

export interface CapturedMoment {
  id: string;
  speakerId: string;
  speakerName: string;
  speakerInitials: string;
  speakerColor: string;
  timestamp: Date;
  text: string;
  isPinned: boolean;
  pinnedText?: string;
}

interface MyMomentsViewProps {
  moments: CapturedMoment[];
  onBack: () => void;
  onPinQuote: (momentId: string, selectedText: string) => void;
}

export function MyMomentsView({ moments, onBack, onPinQuote }: MyMomentsViewProps) {
  const [expandedMomentId, setExpandedMomentId] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "pinned" | "unpinned">("all");
  
  // Translation state
  const [translatingMomentId, setTranslatingMomentId] = useState<string | null>(null);
  const [pressingMomentId, setPressingMomentId] = useState<string | null>(null);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return `Today at ${formatTime(date)}`;
    }
    
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleTextSelection = (momentId: string) => {
    const selection = // window - removed for RN //getSelection();
    const text = selection?.toString().trim();
    
    if (text && text.length > 0) {
      setSelectedText(text);
    }
  };

  const handlePinQuote = (momentId: string) => {
    if (selectedText) {
      onPinQuote(momentId, selectedText);
      setSelectedText("");
      setExpandedMomentId(null);
    }
  };

  // Translation handlers
  const handlePressStart = (momentId: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPressingMomentId(momentId);
    
    pressTimerRef.current = setTimeout(() => {
      toggleTranslation(momentId);
      setPressingMomentId(null);
    }, 200);
  };

  const handlePressEnd = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setPressingMomentId(null);
  };

  const handlePressCancel = () => {
    handlePressEnd();
  };

  const toggleTranslation = (momentId: string) => {
    const moment = moments.find(m => m.id === momentId);
    if (moment && momentTranslations[moment.text]) {
      setTranslatingMomentId(translatingMomentId === momentId ? null : momentId);
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  };

  const handleDoubleClick = (momentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTranslation(momentId);
  };

  // Filter and search moments
  const filteredMoments = moments.filter(moment => {
    // Apply filter type
    if (filterType === "pinned" && !moment.isPinned) return false;
    if (filterType === "unpinned" && moment.isPinned) return false;

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        moment.text.toLowerCase().includes(query) ||
        moment.speakerName.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <View className="h-full flex flex-col bg-[#FFFBF5]">
      {/* Header */}
      <View className="px-6 pt-6 pb-4 bg-white/60 backdrop-blur-xl border-b border-[#2A0098]/10">
        <View className="flex items-center gap-3 mb-3">
          <button
            onPress={onBack}
            className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm border border-white/60 flex items-center justify-center hover:bg-white/80 transition-all focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5]"
            aria-label="Back to conversation"
          >
            <ArrowLeft className="w-5 h-5 text-[#2A0098]" strokeWidth={2} aria-hidden="true" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-[#2A0098]">My Moments</Text>
            <Text className="text-[#6B5CAC] text-xs mt-0.5">
              Press & hold any moment to translate
            </Text>
            <Text className="text-[#6B5CAC]">
              {filteredMoments.length} of {moments.length} {moments.length === 1 ? 'moment' : 'moments'}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B5CAC]" strokeWidth={2} aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search moments..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/60 text-[#2A0098] placeholder:text-[#6B5CAC]/50 focus:outline-none focus:ring-2 focus:ring-[#FF85A2] focus:border-[#FF85A2] transition-all"
            aria-label="Search captured moments"
          />
          {searchQuery && (
            <button
              onPress={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#6B5CAC]"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-[#6B5CAC]" strokeWidth={2} aria-hidden="true" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Buttons */}
        <View className="flex gap-3">
          <button
            onPress={() => setFilterType("all")}
            className={`flex-1 py-2 px-2.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#2A0098] focus:ring-offset-2 focus:ring-offset-white/60 text-center relative overflow-hidden ${
              filterType === "all"
                ? "bg-[#2A0098] text-white shadow-lg border border-[#2A0098]"
                : "bg-white/90 backdrop-blur-sm border border-[#2A0098]/20 text-[#2A0098] hover:border-[#2A0098]/40 hover:bg-white"
            }`}
            aria-label="Show all moments"
            aria-pressed={filterType === "all"}
          >
            {filterType === "all" && (
              <Text className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" aria-hidden="true"></Text>
            )}
            <Text className="text-sm relative z-10">All</Text>
          </TouchableOpacity>
          <button
            onPress={() => setFilterType("unpinned")}
            className={`flex-1 py-2 px-2.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#2A0098] focus:ring-offset-2 focus:ring-offset-white/60 text-center relative overflow-hidden ${
              filterType === "unpinned"
                ? "bg-[#2A0098] text-white shadow-lg border border-[#2A0098]"
                : "bg-white/90 backdrop-blur-sm border border-[#2A0098]/20 text-[#2A0098] hover:border-[#2A0098]/40 hover:bg-white"
            }`}
            aria-label="Show unpinned moments only"
            aria-pressed={filterType === "unpinned"}
          >
            {filterType === "unpinned" && (
              <Text className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" aria-hidden="true"></Text>
            )}
            <Text className="text-sm relative z-10">To Review</Text>
          </TouchableOpacity>
          <button
            onPress={() => setFilterType("pinned")}
            className={`flex-1 py-2 px-2.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#2A0098] focus:ring-offset-2 focus:ring-offset-white/60 text-center relative overflow-hidden ${
              filterType === "pinned"
                ? "bg-[#2A0098] text-white shadow-lg border border-[#2A0098]"
                : "bg-white/90 backdrop-blur-sm border border-[#2A0098]/20 text-[#2A0098] hover:border-[#2A0098]/40 hover:bg-white"
            }`}
            aria-label="Show pinned moments only"
            aria-pressed={filterType === "pinned"}
          >
            {filterType === "pinned" && (
              <Text className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" aria-hidden="true"></Text>
            )}
            <Text className="text-sm relative z-10">Pinned</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Moments List */}
      <View className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
        {filteredMoments.length === 0 && moments.length === 0 ? (
          <View className="h-full flex flex-col items-center justify-center text-center px-6">
            <View className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF85A2]/20 to-[#FFB3C6]/10 flex items-center justify-center mb-4">
              <Sparkles className="w-10 h-10 text-[#FF85A2]" strokeWidth={2} aria-hidden="true" />
            </View>
            <Text className="text-[#2A0098] mb-2">No moments captured yet</Text>
            <Text className="text-[#6B5CAC] text-sm max-w-xs">
              Tap the bookmark button during conversations to save important moments for later
            </Text>
          </View>
        ) : filteredMoments.length === 0 ? (
          <View className="h-full flex flex-col items-center justify-center text-center px-6">
            <View className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6B5CAC]/20 to-[#8B7BC8]/10 flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-[#6B5CAC]" strokeWidth={2} aria-hidden="true" />
            </View>
            <Text className="text-[#2A0098] mb-2">No moments found</Text>
            <Text className="text-[#6B5CAC] text-sm max-w-xs">
              Try adjusting your search or filter
            </Text>
          </View>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredMoments.map((moment) => {
              const isExpanded = expandedMomentId === moment.id;
              const isPinned = moment.isPinned;
              
              return (
                <Animated.View
                  key={moment.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`rounded-2xl border overflow-hidden transition-all ${
                    translatingMomentId === moment.id
                      ? (momentTranslations[moment.text]?.languageCode === 'en'
                          ? 'bg-gradient-to-br from-[#3B82F6]/20 to-[#60A5FA]/20 backdrop-blur-xl border-2 border-[#3B82F6]/40'
                          : 'bg-gradient-to-br from-[#FF85A2]/20 to-[#FFB3C6]/20 backdrop-blur-xl border-2 border-[#FF85A2]/40')
                      : 'bg-white/70 backdrop-blur-sm border-white/80 shadow-sm'
                  } ${
                    isPinned && translatingMomentId !== moment.id ? 'opacity-60' : ''
                  } ${
                    pressingMomentId === moment.id ? 'scale-[0.98]' : ''
                  }`}
                >
                  <View className="p-4 relative">
                    {/* Press progress indicator */}
                    {/* AnimatePresence - replace with conditional render */
                      {pressingMomentId === moment.id && (
                        <Animated.View
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          exit={{ scaleX: 0 }}
                          transition={{ duration: 0.2, ease: "linear" }}
                          className="absolute bottom-0 left-0 right-0 h-1 origin-left bg-[#FF85A2]/40"
                          style={{ borderRadius: '0 0 16px 16px' }}
                        />
                      )}
                    

                    <button
                      onPress={() => setExpandedMomentId(isExpanded ? null : moment.id)}
                      className="w-full text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#6B5CAC] rounded-lg p-0 mb-3"
                      aria-expanded={isExpanded}
                    >
                      <View className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback 
                            className="text-white"
                            style={{ 
                              background: `linear-gradient(to bottom right, ${moment.speakerColor}, ${moment.speakerColor}dd)` 
                            }}
                          >
                            {moment.speakerInitials}
                          </AvatarFallback>
                        </Avatar>
                        <View className="flex-1 min-w-0">
                          <View className="flex items-center justify-between gap-2 mb-1">
                            <Text className="text-[#2A0098]">{moment.speakerName}</Text>
                            {isPinned && (
                              <View className="flex items-center gap-1 text-[#10B981] text-xs">
                                <Check className="w-3 h-3" strokeWidth={2.5} aria-hidden="true" />
                                <span>Pinned</Text>
                              </View>
                            )}
                          </View>
                          <Text className="text-[#6B5CAC] text-xs">{formatDate(moment.timestamp)}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {/* Translation overlay */}
                    {/* AnimatePresence - replace with conditional render */
                      {translatingMomentId === moment.id && momentTranslations[moment.text] && (
                        <Animated.View
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -10, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mb-3"
                        >
                          <View className="flex items-center justify-between mb-2">
                            <View className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs ${
                              momentTranslations[moment.text].languageCode === 'en'
                                ? 'bg-[#3B82F6]/20 text-[#3B82F6]'
                                : 'bg-[#FF85A2]/20 text-[#FF85A2]'
                            }`} style={{ fontWeight: 600 }}>
                              <span>
                                {momentTranslations[moment.text].languageCode === 'en' ? '🇫🇷' : '🇬🇧'}
                              </Text>
                              <Text className="text-[#2A0098]/40">→</Text>
                              <span>{momentTranslations[moment.text].flag}</Text>
                              <Text className="ml-1">{momentTranslations[moment.text].language}</Text>
                            </View>
                            <button
                              onPress={() => setTranslatingMomentId(null)}
                              className="w-5 h-5 rounded-full bg-[#2A0098]/10 hover:bg-[#2A0098]/20 flex items-center justify-center transition-colors"
                              aria-label="Hide translation"
                            >
                              <X className="w-3 h-3 text-[#2A0098]" strokeWidth={2.5} />
                            </TouchableOpacity>
                          </View>
                          <Text className="leading-relaxed text-sm text-[#2A0098] mb-2" style={{ fontWeight: 500 }}>
                            {momentTranslations[moment.text].text}
                          </Text>
                          <View className="border-t border-[#2A0098]/10 pt-2"></View>
                        </Animated.View>
                      )}
                    
                    
                    <div
                      onMouseDown={(e) => !isExpanded && momentTranslations[moment.text] && handlePressStart(moment.id, e)}
                      onMouseUp={(e) => {
                        if (!isExpanded && momentTranslations[moment.text]) {
                          handlePressEnd();
                        } else if (isExpanded) {
                          handleTextSelection(moment.id);
                        }
                      }}
                      onMouseLeave={() => !isExpanded && handlePressCancel()}
                      onTouchStart={(e) => !isExpanded && momentTranslations[moment.text] && handlePressStart(moment.id, e)}
                      onTouchEnd={(e) => {
                        if (!isExpanded && momentTranslations[moment.text]) {
                          handlePressEnd();
                        } else if (isExpanded) {
                          handleTextSelection(moment.id);
                        }
                      }}
                      onTouchCancel={() => !isExpanded && handlePressCancel()}
                      onDoubleClick={(e) => !isExpanded && handleDoubleClick(moment.id, e)}
                      style={{ cursor: !isExpanded && momentTranslations[moment.text] ? 'pointer' : isExpanded ? 'text' : 'default' }}
                    >
                      <Text 
                        className={`text-sm leading-relaxed ${isExpanded ? 'select-text' : 'select-none'} ${
                          translatingMomentId === moment.id ? 'text-[#2A0098]/50 italic' : 'text-[#2A0098]'
                        } ${isExpanded ? '' : 'line-clamp-2'}`}
                      >
                        {moment.text}
                      </Text>
                    </View>
                    
                    {!isExpanded && (
                      <button
                        onPress={() => setExpandedMomentId(moment.id)}
                        className="text-[#6B5CAC] text-xs mt-2 hover:text-[#2A0098] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] rounded px-2 py-1"
                        aria-label="Expand moment to select text"
                      >
                        {momentTranslations[moment.text] 
                          ? 'Press & hold to translate • Tap to expand & select text'
                          : 'Tap to expand & select text'}
                      </TouchableOpacity>
                    )}
                  </View>
                  
                  {/* Expanded Actions */}
                  {isExpanded && !isPinned && (
                    <Animated.View
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-white/60 p-4 bg-gradient-to-br from-[#FF85A2]/5 to-[#FFB3C6]/5"
                    >
                      <Text className="text-[#6B5CAC] text-xs mb-3">
                        {selectedText 
                          ? "Selection ready! Pin this as a key quote?" 
                          : "Drag to select the key phrase you want to save"}
                      </Text>
                      
                      {selectedText && (
                        <View className="mb-3 p-3 rounded-xl bg-white/60 border border-[#FF85A2]/30">
                          <Text className="text-[#2A0098] text-sm italic">"{selectedText}"</Text>
                        </View>
                      )}
                      
                      <button
                        onPress={() => handlePinQuote(moment.id)}
                        disabled={!selectedText}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF85A2] to-[#FFB3C6] text-white shadow-md hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#FF85A2] focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all flex items-center justify-center gap-2"
                        aria-label="Pin selected text as key quote"
                      >
                        <Sparkles className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                        <span>Pin as Key Quote</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                </Animated.View>
              );
            })}
          
        )}
      </View>
    </View>
  );
}
