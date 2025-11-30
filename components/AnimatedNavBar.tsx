import { View } from 'react-native';
import { Home, FileText, Radar, Target } from "lucide-react-native";
import { motion } from "react-native-reanimated";

export function AnimatedNavBar() {
  const navItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: FileText, label: 'Hub', active: false },
    { icon: Radar, label: 'Scout', active: false },
    { icon: Target, label: 'Focus', active: false },
  ];

  return (
    <View className="absolute bottom-0 left-0 right-0">
      {/* Background */}
      <View className="absolute inset-0 bg-white/95 backdrop-blur-md border-t border-[#E8E8E8] shadow-[0_-2px_20px_rgba(0,0,0,0.06)]"></View>
      
      <View className="relative px-6 py-3">
        <View className="flex items-center justify-between relative">
          {/* Animated bubble background */}
          <Animated.View
            layoutId="bubble"
            className="absolute bg-[#D8FDCC] rounded-xl shadow-sm"
            style={{ zIndex: 0 }}
            initial={false}
            animate={{
              width: '64px',
              height: '56px',
              left: '0px',
              top: '50%',
              y: '-50%',
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
          />
          
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="relative z-10 flex flex-col items-center justify-center w-16 h-14 transition-all"
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    item.active
                      ? 'text-[#2A0098]'
                      : 'text-[#999999]'
                  }`}
                  strokeWidth={item.active ? 2.5 : 2}
                />
                <span
                  className={`text-xs mt-1 transition-colors ${
                    item.active
                      ? 'text-[#2A0098]'
                      : 'text-[#999999]'
                  }`}
                  style={{ fontSize: '0.65rem', fontWeight: item.active ? '600' : '500' }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
