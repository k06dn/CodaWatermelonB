import { Text } from 'react-native';
import { useState } from "react";
import { Users, BookOpen, Sparkles } from "lucide-react-native";
import { GroupConsentWrapper } from "./GroupConsentWrapper";
import { LectureMode } from "./LectureMode";
import { MyMomentsView, CapturedMoment } from "./MyMomentsView";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { motion, AnimatePresence } from "react-native-reanimated";
import { toast } from "react-native-toast-message";

interface TalkViewProps {
  userName?: string;
}

export function TalkView({ userName }: TalkViewProps) {
  const [showMyMoments, setShowMyMoments] = useState(false);
  const [capturedMoments, setCapturedMoments] = useState<CapturedMoment[]>([]);

  const handleCaptureMoment = (
    speakerId: string,
    speakerName: string,
    speakerInitials: string,
    speakerColor: string,
    text: string
  ) => {
    const newMoment: CapturedMoment = {
      id: `moment-${Date.now()}`,
      speakerId,
      speakerName,
      speakerInitials,
      speakerColor,
      timestamp: new Date(),
      text,
      isPinned: false,
    };

    setCapturedMoments(prev => [...prev, newMoment]);
  };

  const handlePinQuote = (momentId: string, selectedText: string) => {
    setCapturedMoments(prev =>
      prev.map(moment =>
        moment.id === momentId
          ? { ...moment, isPinned: true, pinnedText: selectedText }
          : moment
      )
    );

    toast.success("Key quote pinned!", {
      description: <Text style={{ color: '#2A0098' }}>You can review it later in your notes</Text>,
    });
  };

  if (showMyMoments) {
    return (
      <MyMomentsView
        moments={capturedMoments}
        onBack={() => setShowMyMoments(false)}
        onPinQuote={handlePinQuote}
      />
    );
  }

  return (
    <Tabs defaultValue="conversation" className="h-full flex flex-col">
      {/* Content - toggle is now integrated into each mode's header */}
      <TabsContent value="conversation" className="flex-1 overflow-hidden mt-0">
        <GroupConsentWrapper 
          userName={userName}
        />
      </TabsContent>
      <TabsContent value="lecture" className="flex-1 overflow-hidden mt-0">
        <LectureMode 
          userName={userName} 
          onCaptureMoment={handleCaptureMoment}
          onViewMyMoments={() => setShowMyMoments(true)}
          momentCount={capturedMoments.length}
        />
      </TabsContent>
    </Tabs>
  );
}
