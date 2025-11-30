import { View, Text } from 'react-native';
import { useState } from "react";
import { motion, AnimatePresence } from "react-native-reanimated";
import { Upload, FileText, Clock, BookOpen, Sparkles, ChevronRight, Trash2 } from "lucide-react-native";
import { Badge } from "./ui/badge";

interface Brief {
  id: string;
  title: string;
  subject: string;
  date: Date;
  readTime: number; // minutes
  vocabularyCount: number;
  conceptsCount: number;
}

const sampleBriefs: Brief[] = [
  {
    id: "1",
    title: "Sustainable Fashion & Textile Waste",
    subject: "Environmental Science",
    date: new Date(Date.now() - 86400000),
    readTime: 5,
    vocabularyCount: 12,
    conceptsCount: 6,
  },
  {
    id: "2",
    title: "Circular Economy Models",
    subject: "Business & Sustainability",
    date: new Date(Date.now() - 172800000),
    readTime: 4,
    vocabularyCount: 8,
    conceptsCount: 4,
  },
  {
    id: "3",
    title: "Climate Justice & Social Equity",
    subject: "Sociology",
    date: new Date(Date.now() - 259200000),
    readTime: 6,
    vocabularyCount: 15,
    conceptsCount: 7,
  },
];

export function LaunchpadView() {
  const [briefs, setBriefs] = useState<Brief[]>(sampleBriefs);
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // In real app, would process the file here
    console.log("File dropped:", e.dataTransfer.files[0]);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const deleteBrief = (id: string) => {
    setBriefs(briefs.filter(b => b.id !== id));
    if (selectedBrief?.id === id) {
      setSelectedBrief(null);
    }
  };

  if (selectedBrief) {
    return (
      <View className="h-full overflow-y-auto px-6 py-6 space-y-6">
        {/* Back button */}
        <button
          onPress={() => setSelectedBrief(null)}
          className="flex items-center gap-2 text-[#6B5CAC] hover:text-[#2A0098] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] rounded-lg px-2 py-1"
          aria-label="Back to briefs list"
        >
          <ChevronRight className="w-4 h-4 rotate-180" aria-hidden="true" />
          <Text className="text-sm">Back to briefs</Text>
        </TouchableOpacity>

        {/* Brief Header */}
        <View className="bg-white/40 backdrop-blur-sm rounded-3xl p-6 border border-white/60 shadow-lg">
          <Badge className="bg-[#FF85A2]/20 text-[#FF85A2] border-[#FF85A2]/30 mb-3">
            {selectedBrief.subject}
          </Badge>
          <Text className="text-[#2A0098] mb-3">{selectedBrief.title}</Text>
          <View className="flex items-center gap-4 text-[#6B5CAC] text-sm">
            <View className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              <span>{selectedBrief.readTime} min read</Text>
            </View>
            <View className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
              <span>{selectedBrief.vocabularyCount} key terms</Text>
            </View>
          </View>
        </View>

        {/* Key Vocabulary */}
        <View className="bg-white/40 backdrop-blur-sm rounded-3xl p-6 border border-white/60">
          <View className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#FF85A2]" strokeWidth={2} aria-hidden="true" />
            <Text className="text-[#2A0098]">Key vocabulary</Text>
          </View>
          <View className="space-y-3">
            {[
              { term: "Fast fashion", definition: "Inexpensive clothing produced rapidly to meet trends, often with environmental and ethical concerns." },
              { term: "Circular economy", definition: "An economic system aimed at eliminating waste through continual reuse of resources." },
              { term: "Textile waste", definition: "Discarded clothing and fabrics, a major contributor to landfill pollution." },
              { term: "Greenwashing", definition: "Misleading claims about environmental benefits to appear more sustainable than reality." },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/60 rounded-2xl p-4 border border-white/60"
              >
                <Text className="text-[#2A0098] mb-1">{item.term}</Text>
                <Text className="text-[#6B5CAC] text-sm leading-relaxed">{item.definition}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Core Concepts */}
        <View className="bg-white/40 backdrop-blur-sm rounded-3xl p-6 border border-white/60">
          <View className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-[#10B981]" strokeWidth={2} aria-hidden="true" />
            <Text className="text-[#2A0098]">Core concepts</Text>
          </View>
          <ul className="space-y-3">
            {[
              "The fashion industry produces 10% of global carbon emissions",
              "One cotton t-shirt requires 2,700 litres of water to produce",
              "UK consumers buy more clothes per person than any other European country",
              "Only 1% of clothing material is recycled into new garments",
              "Fast fashion's business model relies on rapid consumption and disposal",
              "Sustainable alternatives include charity shops, clothing swaps, and ethical brands",
            ].map((concept, index) => (
              <li
                key={index}
                className="flex gap-3 bg-white/60 rounded-2xl p-4 border border-white/60"
              >
                <View className="w-6 h-6 rounded-full bg-[#10B981]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Text className="text-[#10B981] text-sm font-medium">{index + 1}</Text>
                </View>
                <Text className="text-[#2A0098] text-sm leading-relaxed flex-1">{concept}</Text>
              </li>
            ))}
          </ul>
        </View>
      </View>
    );
  }

  return (
    <View className="h-full overflow-y-auto px-6 py-6 space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-white/40 backdrop-blur-sm rounded-3xl p-8 border-2 border-dashed transition-all ${
          isDragging
            ? "border-[#FF85A2] bg-[#FF85A2]/10 scale-[1.02]"
            : "border-white/60 hover:border-[#6B5CAC]/40 hover:bg-white/60"
        }`}
        role="region"
        aria-label="Upload lecture materials"
      >
        <View className="flex flex-col items-center text-center">
          <View className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF85A2] to-[#FFB3C6] flex items-center justify-center mb-4 shadow-lg">
            <Upload className="w-8 h-8 text-white" strokeWidth={2} aria-hidden="true" />
          </View>
          <Text className="text-[#2A0098] mb-2">Upload lecture materials</Text>
          <Text className="text-[#6B5CAC] text-sm mb-4 max-w-sm">
            Drop your slides or reading here, or click to browse. AI will generate a 5-minute brief with key terms and concepts.
          </Text>
          <button
            className="px-6 py-3 rounded-2xl bg-white/60 border border-white/60 text-[#2A0098] font-medium hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-white/40 transition-all"
            aria-label="Browse files to upload"
          >
            Browse files
          </TouchableOpacity>
          <Text className="text-[#6B5CAC] text-xs mt-3">
            Supports PDF, PowerPoint, Word documents
          </Text>
        </View>
      </View>

      {/* Recent Briefs */}
      {briefs.length > 0 && (
        <div>
          <View className="flex items-center justify-between mb-4">
            <Text className="text-[#2A0098]">Recent briefs</Text>
            <Badge variant="secondary" className="bg-[#6B5CAC]/10 text-[#6B5CAC]">
              {briefs.length} saved
            </Badge>
          </View>

          <View className="space-y-3">
            {briefs.map((brief) => (
              <Animated.View
                key={brief.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <View className="w-full bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/60 hover:bg-white/60 hover:shadow-lg transition-all group relative">
                  <button
                    onPress={() => setSelectedBrief(brief)}
                    className="w-full text-left focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] rounded-lg"
                    aria-label={`View brief for ${brief.title}`}
                  >
                    <View className="flex gap-3">
                      <View className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6B5CAC] to-[#8B7BC8] flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-white" strokeWidth={2} aria-hidden="true" />
                      </View>
                      <View className="flex-1 min-w-0 pr-10">
                        <View className="flex items-start justify-between gap-2 mb-1">
                          <Text className="text-[#2A0098] truncate">{brief.title}</Text>
                          <ChevronRight 
                            className="w-5 h-5 text-[#6B5CAC] flex-shrink-0 group-hover:translate-x-1 transition-transform" 
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        </View>
                        <Text className="text-[#6B5CAC] text-sm mb-2">{brief.subject}</Text>
                        <View className="flex items-center gap-3 text-[#6B5CAC] text-xs">
                          <span>{formatDate(brief.date)}</Text>
                          <span>•</Text>
                          <span>{brief.readTime} min</Text>
                          <span>•</Text>
                          <span>{brief.vocabularyCount} terms</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <button
                    onPress={(e) => {
                      e.stopPropagation();
                      deleteBrief(brief.id);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-red-100 text-[#6B5CAC] hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white/40 z-10"
                    aria-label={`Delete brief for ${brief.title}`}
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>
      )}

      {/* Info Card */}
      <View 
        className="bg-[#D8FDCC]/20 backdrop-blur-sm rounded-2xl p-4 border border-[#D8FDCC]/40"
        role="region"
        aria-label="Launchpad information"
      >
        <View className="flex items-start gap-3">
          <View className="w-10 h-10 rounded-xl bg-[#D8FDCC]/40 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#2A0098]" strokeWidth={2} aria-hidden="true" />
          </View>
          <View className="flex-1">
            <Text className="text-[#2A0098] mb-1">Pre-lecture preparation</Text>
            <Text className="text-[#6B5CAC] text-sm leading-relaxed">
              Upload your materials before class to get familiar with key vocabulary and core concepts. Arrive prepared and confident.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
