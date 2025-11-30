import { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { Radar, MessageCircle, Users, Bell, BookOpen, Settings } from 'lucide-react-native';
import { AwareScreen } from './AwareScreen';
import { TalkView } from './TalkView';
import { CommunityView } from './CommunityView';
import { AlertsView } from './AlertsView';
import { StudyView } from './StudyView';
import { WaveLoader } from './WaveLoader';
import { SettingsView } from './SettingsView';
import { OfflineIndicator } from './OfflineIndicator';
import { OnboardingFlow, type OnboardingData } from './OnboardingFlow';
import Toast from 'react-native-toast-message';
import { storageHelpers } from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';

export type AppView = 'aware' | 'talk' | 'connect' | 'study' | 'alerts' | 'settings';

interface NavItem {
  id: AppView;
  icon: React.ComponentType<any>;
  label: string;
}

export function CodaApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeView, setActiveView] = useState<AppView>('aware');
  const [currentSubView, setCurrentSubView] = useState<'aware' | 'conversation' | 'scout' | 'study' | 'alerts'>('aware');
  const [userName, setUserName] = useState<string>('there');
  const { settings, updateSettings } = useTheme();

  // Animation values
  const settingsOpacity = useSharedValue(0);
  const settingsScale = useSharedValue(0.8);

  // Initialize and check onboarding
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // Check onboarding after a brief delay
    setTimeout(async () => {
      setIsLoading(false);

      const onboardingComplete = await storageHelpers.isOnboardingComplete();
      const storedUserName = await storageHelpers.getUserName();

      if (!onboardingComplete) {
        setShowOnboarding(true);
      } else if (storedUserName) {
        setUserName(storedUserName);
      }
    }, 2000);
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    // Store onboarding data
    await storageHelpers.setOnboardingComplete(data);

    setUserName(data.name);
    setShowOnboarding(false);

    // Welcome toast
    Toast.show({
      type: 'success',
      text1: `Welcome to Coda, ${data.name}! 👋`,
      text2: "We're here to support your independence.",
      position: 'top',
    });
  };

  const navItems: NavItem[] = [
    { id: 'aware', icon: Radar, label: 'Aware' },
    { id: 'talk', icon: MessageCircle, label: 'Talk' },
    { id: 'connect', icon: Users, label: 'Connect' },
    { id: 'study', icon: BookOpen, label: 'Study' },
    { id: 'alerts', icon: Bell, label: 'Alerts' },
  ];

  const renderView = () => {
    if (activeView === 'settings') {
      return <SettingsView onClose={() => setActiveView('aware')} userName={userName} />;
    }
    return (
      <AwareScreen
        userName={userName}
        onOpenSettings={() => setActiveView('settings')}
        onViewChange={(view) => setCurrentSubView(view)}
      />
    );
  };

  // Determine if settings button should show
  const shouldShowSettings = activeView !== 'settings' && (currentSubView === 'aware' || currentSubView === 'alerts');

  // Animate settings button visibility
  useEffect(() => {
    if (shouldShowSettings) {
      settingsOpacity.value = withTiming(1, { duration: 200 });
      settingsScale.value = withTiming(1, { duration: 200 });
    } else {
      settingsOpacity.value = withTiming(0, { duration: 200 });
      settingsScale.value = withTiming(0.8, { duration: 200 });
    }
  }, [shouldShowSettings]);

  const settingsButtonStyle = useAnimatedStyle(() => ({
    opacity: settingsOpacity.value,
    transform: [{ scale: settingsScale.value }],
  }));

  // Show loading screen
  if (isLoading) {
    return <WaveLoader />;
  }

  // Show onboarding flow
  if (showOnboarding) {
    return (
      <>
        <OnboardingFlow onComplete={handleOnboardingComplete} />
        <Toast />
      </>
    );
  }

  return (
    <View className="h-full flex flex-col bg-[#FFFBF5] relative">
      {/* Offline Indicator */}
      <OfflineIndicator />

      {/* Settings Button - Only on Aware and Alerts pages */}
      {shouldShowSettings && (
        <Animated.View
          style={settingsButtonStyle}
          className="absolute top-2 right-6 z-50"
        >
          <TouchableOpacity
            onPress={() => setActiveView('settings')}
            className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-lg flex items-center justify-center active:bg-white/90 active:scale-95"
            accessibilityLabel="Open settings"
          >
            <Settings color="#2A0098" size={20} strokeWidth={2} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Main Content Area */}
      <View className="flex-1 overflow-hidden">
        {renderView()}
      </View>

      {/* Toast Notifications */}
      <Toast />
    </View>
  );
}