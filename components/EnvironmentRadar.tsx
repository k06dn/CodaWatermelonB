import { View, Text } from 'react-native';
import { motion, AnimatePresence } from "react-native-reanimated";
import { Volume2, Music, Users, Car, Bell as BellIcon, Phone, Dog, AlertCircle } from "lucide-react-native";
import { useState, useEffect } from "react";

// Define 8 directional sectors for realistic spatial audio positioning
type Sector = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

interface SoundEvent {
  id: string;
  type: string;
  icon: any;
  sector: Sector;
  distance: "close" | "medium" | "far";
  label: string;
  intensity: number;
  color: string;
  confidence: number; // 0-1, how confident the system is about location
}

// Scenario: User is walking through campus
const scenarios = [
  // Initial state - in common room
  [
    {
      id: "1",
      type: "conversation",
      icon: Users,
      sector: "NE" as Sector,
      distance: "medium" as const,
      label: "Group conversation",
      intensity: 0.7,
      color: "from-[#6B5CAC] to-[#8B7BC8]",
      confidence: 0.85,
    },
    {
      id: "2",
      type: "music",
      icon: Music,
      sector: "SE" as Sector,
      distance: "close" as const,
      label: "Background music",
      intensity: 0.4,
      color: "from-[#FF85A2] to-[#FFB3C6]",
      confidence: 0.92,
    },
  ],
  // Walking outside - traffic appears
  [
    {
      id: "2",
      type: "music",
      icon: Music,
      sector: "E" as Sector,
      distance: "medium" as const,
      label: "Background music",
      intensity: 0.3,
      color: "from-[#FF85A2] to-[#FFB3C6]",
      confidence: 0.78,
    },
    {
      id: "3",
      type: "traffic",
      icon: Car,
      sector: "W" as Sector,
      distance: "far" as const,
      label: "Traffic noise",
      intensity: 0.5,
      color: "from-[#FFD88A] to-[#FFE5A8]",
      confidence: 0.88,
    },
  ],
  // Dog appears nearby!
  [
    {
      id: "3",
      type: "traffic",
      icon: Car,
      sector: "W" as Sector,
      distance: "far" as const,
      label: "Traffic noise",
      intensity: 0.5,
      color: "from-[#FFD88A] to-[#FFE5A8]",
      confidence: 0.88,
    },
    {
      id: "4",
      type: "dog",
      icon: Dog,
      sector: "N" as Sector,
      distance: "close" as const,
      label: "Dog barking",
      intensity: 0.8,
      color: "from-[#10B981] to-[#34D399]",
      confidence: 0.95,
    },
  ],
  // Entering building - construction sounds
  [
    {
      id: "4",
      type: "dog",
      icon: Dog,
      sector: "S" as Sector,
      distance: "medium" as const,
      label: "Dog barking",
      intensity: 0.5,
      color: "from-[#10B981] to-[#34D399]",
      confidence: 0.82,
    },
    {
      id: "5",
      type: "alert",
      icon: AlertCircle,
      sector: "NW" as Sector,
      distance: "medium" as const,
      label: "Construction noise",
      intensity: 0.6,
      color: "from-[#F59E0B] to-[#FBBF24]",
      confidence: 0.76,
    },
  ],
  // Back to initial
  [
    {
      id: "1",
      type: "conversation",
      icon: Users,
      sector: "NE" as Sector,
      distance: "medium" as const,
      label: "Group conversation",
      intensity: 0.7,
      color: "from-[#6B5CAC] to-[#8B7BC8]",
      confidence: 0.85,
    },
    {
      id: "2",
      type: "music",
      icon: Music,
      sector: "SE" as Sector,
      distance: "close" as const,
      label: "Background music",
      intensity: 0.4,
      color: "from-[#FF85A2] to-[#FFB3C6]",
      confidence: 0.92,
    },
  ],
];

interface EnvironmentRadarProps {
  userName?: string;
}

export function EnvironmentRadar({ userName = "there" }: EnvironmentRadarProps) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [soundEvents, setSoundEvents] = useState<SoundEvent[]>(scenarios[0]);

  const [pulseKey, setPulseKey] = useState(0);

  // Cycle through scenarios for showcase purposes
  useEffect(() => {
    const interval = setInterval(() => {
      setScenarioIndex((prev) => (prev + 1) % scenarios.length);
    }, 11000); // 11 seconds per scenario
    return () => clearInterval(interval);
  }, []);

  // Update sound events when scenario changes
  useEffect(() => {
    setSoundEvents(scenarios[scenarioIndex]);
  }, [scenarioIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseKey(prev => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Convert sector to angle range (center of wedge)
  const getSectorAngle = (sector: Sector): number => {
    const sectorAngles: Record<Sector, number> = {
      N: 270,   // Top (12 o'clock)
      NE: 315,  // Top-right
      E: 0,     // Right (3 o'clock)
      SE: 45,   // Bottom-right
      S: 90,    // Bottom (6 o'clock)
      SW: 135,  // Bottom-left
      W: 180,   // Left (9 o'clock)
      NW: 225,  // Top-left
    };
    return sectorAngles[sector];
  };

  // Get distance multiplier (0.3 = close, 0.6 = medium, 0.85 = far)
  const getDistanceMultiplier = (distance: "close" | "medium" | "far"): number => {
    const multipliers = { close: 0.3, medium: 0.6, far: 0.85 };
    return multipliers[distance];
  };

  const getPosition = (sector: Sector, distance: "close" | "medium" | "far") => {
    const angle = getSectorAngle(sector);
    const distMult = getDistanceMultiplier(distance);
    const rad = (angle * Math.PI) / 180;
    const x = 50 + distMult * 40 * Math.cos(rad);
    const y = 50 + distMult * 40 * Math.sin(rad);
    return { x, y, angle };
  };

  const getDistanceLabel = (distance: "close" | "medium" | "far"): string => {
    const labels = { close: "Nearby", medium: "Moderate distance", far: "Far away" };
    return labels[distance];
  };

  return (
    <View className="h-full flex flex-col">
      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <Text className="text-[#2A0098]">Hello, {userName}</Text>
        <Text className="text-[#6B5CAC]">Real-time awareness of your surroundings</Text>
      </View>

      {/* Radar visualisation - glassmorphic */}
      <View className="flex-1 flex items-center justify-center px-6 pb-8">
        <View className="relative w-full max-w-[340px] aspect-square">
          {/* Glassmorphic background */}
          <View className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-full border border-white/60 shadow-xl"></View>
          
          {/* Radar circles */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {/* Concentric circles with labels */}
            {[
              { r: 30, label: "Close" },
              { r: 60, label: "Medium" },
              { r: 85, label: "Far" }
            ].map(({ r, label }, i) => (
              <g key={r}>
                <circle
                  cx="50"
                  cy="50"
                  r={r / 2}
                  fill="none"
                  stroke="rgba(42, 0, 152, 0.15)"
                  strokeWidth="0.5"
                />
              </g>
            ))}
            
            {/* 8 directional sector lines */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              const x1 = 50 + 10 * Math.cos(rad);
              const y1 = 50 + 10 * Math.sin(rad);
              const x2 = 50 + 45 * Math.cos(rad);
              const y2 = 50 + 45 * Math.sin(rad);
              return (
                <line
                  key={angle}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(42, 0, 152, 0.1)"
                  strokeWidth="0.3"
                  strokeDasharray="1,1"
                />
              );
            })}
            
            {/* Centre point */}
            <circle cx="50" cy="50" r="2.5" fill="#2A0098" />
            
            {/* Pulsing wave effect */}
            <motion.circle
              key={pulseKey}
              cx="50"
              cy="50"
              r="0"
              fill="none"
              stroke="rgba(107, 92, 172, 0.5)"
              strokeWidth="1"
              initial={{ r: 0, opacity: 1 }}
              animate={{ r: 45, opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            
            {/* Cardinal direction markers */}
            <text x="50" y="8" textAnchor="middle" fill="rgba(42, 0, 152, 0.4)" fontSize="4" fontWeight="600">N</text>
            <text x="92" y="52" textAnchor="middle" fill="rgba(42, 0, 152, 0.4)" fontSize="4" fontWeight="600">E</text>
            <text x="50" y="96" textAnchor="middle" fill="rgba(42, 0, 152, 0.4)" fontSize="4" fontWeight="600">S</text>
            <text x="8" y="52" textAnchor="middle" fill="rgba(42, 0, 152, 0.4)" fontSize="4" fontWeight="600">W</text>
          </svg>

          {/* Sound event markers with wedge uncertainty zones */}
          <AnimatePresence mode="popLayout">
            {soundEvents.map((event) => {
              const pos = getPosition(event.sector, event.distance);
              const Icon = event.icon;
              
              return (
                <Animated.View
                  key={event.id}
                  className="absolute"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Glow effect */}
                  <Animated.View
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${event.color} blur-xl opacity-40`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  {/* Icon container - glassmorphic */}
                  <View className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center shadow-lg backdrop-blur-sm`}>
                    <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                  </View>
                  
                  {/* Confidence indicator ring */}
                  <svg className="absolute inset-0 w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray={`${event.confidence * 100} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                </Animated.View>
              );
            })}
          
        </View>
      </View>

      {/* Sound events list */}
      <View className="px-6 pb-6 space-y-3">
        <View className="flex items-center justify-between mb-3">
          <Text className="text-[#6B5CAC] text-xs uppercase tracking-wider" style={{ fontFamily: 'var(--font-sans)' }}>Detected Sounds</Text>
          <Text className="text-[#6B5CAC] text-xs bg-white/40 backdrop-blur-sm px-2 py-1 rounded-full border border-white/60">
            Approximate location
          </Text>
        </View>
        <AnimatePresence mode="popLayout">
          {soundEvents.map((event) => {
            const Icon = event.icon;
            return (
              <Animated.View
                key={event.id}
                layout
                className="bg-white/50 backdrop-blur-xl rounded-3xl p-4 flex items-center gap-3 border border-white/60 shadow-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <View className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${event.color} flex items-center justify-center flex-shrink-0 shadow-md relative`}>
                  <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  {/* Confidence badge */}
                  <View className="absolute -top-1 -right-1 bg-white text-[#2A0098] text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-sm" style={{ fontSize: '9px', fontWeight: 600 }}>
                    {Math.round(event.confidence * 100)}
                  </View>
                </View>
                <View className="flex-1 min-w-0">
                  <View className="flex items-center gap-2">
                    <Text className="text-[#2A0098]">{event.label}</Text>
                  </View>
                  <Text className="text-[#6B5CAC] text-xs">
                    {event.sector} · {getDistanceLabel(event.distance)} · {Math.round(event.intensity * 100)}% intensity
                  </Text>
                </View>
                {/* Intensity bar */}
                <View className="w-16 h-2 bg-white/60 rounded-full overflow-hidden backdrop-blur-sm">
                  <Animated.View
                    className={`h-full bg-gradient-to-r ${event.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${event.intensity * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </View>
              </Animated.View>
            );
          })}
        
      </View>
    </View>
  );
}
