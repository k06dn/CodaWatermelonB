import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import NetInfo from '@react-native-community/netinfo';
import { WifiOff, Wifi } from 'lucide-react-native';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = state.isConnected ?? true;

      if (online && !isOnline) {
        // Just reconnected
        setShowReconnected(true);
        setTimeout(() => setShowReconnected(false), 3000);
      }

      setIsOnline(online);
    });

    return () => unsubscribe();
  }, [isOnline]);

  useEffect(() => {
    if (!isOnline || showReconnected) {
      translateY.value = withSpring(0, { damping: 20 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withSpring(-100);
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [isOnline, showReconnected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const bgColor = isOnline ? 'bg-[#10B981]/90' : 'bg-red-500/90';
  const borderColor = isOnline ? 'border-[#10B981]/50' : 'border-red-400/50';

  return (
    <Animated.View
      style={animatedStyle}
      className={`absolute top-2 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-xl backdrop-blur-xl border shadow-lg flex flex-row items-center gap-2 ${bgColor} ${borderColor}`}
    >
      {isOnline ? (
        <>
          <Wifi color="white" size={16} strokeWidth={2} />
          <Text className="text-white text-sm leading-none">Back online</Text>
        </>
      ) : (
        <>
          <WifiOff color="white" size={16} strokeWidth={2} />
          <Text className="text-white text-sm leading-none">No internet connection</Text>
        </>
      )}
    </Animated.View>
  );
}
