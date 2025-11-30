import { useState, useEffect } from "react";
import { GroupConsentHost } from "./GroupConsentHost";
import { GroupConsentParticipant } from "./GroupConsentParticipant";
import { ConversationMode } from "./ConversationMode";
import { toast } from "react-native-toast-message";

interface Participant {
  id: string;
  name: string;
  hasConsented: boolean;
  joinedAt: Date;
}

interface GroupConsentWrapperProps {
  userName?: string;
}

type ConsentFlow = "host" | "participant" | "recording" | "solo-mode";

export function GroupConsentWrapper({ userName = "You" }: GroupConsentWrapperProps) {
  const [currentFlow, setCurrentFlow] = useState<ConsentFlow | null>(null);
  const [sessionParticipants, setSessionParticipants] = useState<Participant[]>([]);

  // Skip directly to solo conversation mode (bypass group consent screens)
  useEffect(() => {
    setCurrentFlow("solo-mode");
  }, []);

  const handleStartRecording = (participants: Participant[]) => {
    // Mark setup as complete
    await storage.setItem("coda-group-consent-setup-complete", "true");
    setSessionParticipants(participants);
    setCurrentFlow("recording");
  };

  const handleCancelSession = () => {
    // Mark setup as complete even if cancelled - user has seen the intro
    await storage.setItem("coda-group-consent-setup-complete", "true");
    setCurrentFlow("solo-mode");
  };

  const handleJoinSession = (participantName: string) => {
    // In a real app, this would send consent to the host
    setCurrentFlow("recording");
  };

  const handleDeclineSession = () => {
    // In a real app, this would navigate away
    setCurrentFlow("host");
  };

  // Show loading state while checking localStorage
  if (currentFlow === null) {
    return null;
  }

  // For demo purposes - you can toggle between host/participant view
  // In production, this would be determined by whether user created or joined
  if (currentFlow === "participant") {
    return (
      <GroupConsentParticipant
        hostName={userName}
        sessionId="demo-session"
        onJoinSession={handleJoinSession}
        onDecline={handleDeclineSession}
      />
    );
  }

  if (currentFlow === "recording") {
    return (
      <ConversationMode 
        userName={userName}
        isGroupSession={true}
        sessionParticipants={sessionParticipants}
        onLeaveSession={() => {
          toast.success("Left session", {
            description: "Your consent has been withdrawn and you've left the group conversation."
          });
          setCurrentFlow("solo-mode");
          setSessionParticipants([]);
        }}
      />
    );
  }

  // Solo mode - user has already completed setup, go straight to conversation
  if (currentFlow === "solo-mode") {
    return (
      <ConversationMode 
        userName={userName}
        isGroupSession={false}
        sessionParticipants={[]}
      />
    );
  }

  // First-time setup flow
  return (
    <GroupConsentHost
      hostName={userName}
      onStartRecording={handleStartRecording}
      onCancel={handleCancelSession}
    />
  );
}
