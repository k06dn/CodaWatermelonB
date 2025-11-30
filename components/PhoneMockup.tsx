import { View } from 'react-native';
import { Wifi, Signal, Battery } from "lucide-react-native";

interface PhoneMockupProps {
  children: React.ReactNode;
}

export function PhoneMockup({ children }: PhoneMockupProps) {
  return (
    <View className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 flex items-center justify-center p-4 sm:p-8">
      {/* iPhone 15 Pro Mockup */}
      <View className="relative scale-[0.75] sm:scale-90 lg:scale-100 origin-center">
        {/* Drop shadow */}
        <View className="absolute inset-0 rounded-[3.5rem] bg-black/20 blur-3xl transform translate-y-12 scale-95" />
        
        {/* Outer frame/bezel */}
        <View 
          className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-[3.5rem] p-3"
          style={{
            width: '393px',
            height: '852px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Screen container with inner bezel */}
          <View className="relative h-full w-full rounded-[3rem] overflow-hidden bg-black">
            {/* Screen content */}
            <View className="relative h-full w-full bg-[#FFFBF5] overflow-hidden">
              {/* Dynamic Island */}
              <View className="absolute top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                <View 
                  className="bg-black rounded-full mt-3"
                  style={{
                    width: '126px',
                    height: '37px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                  }}
                />
              </View>



              {/* App content */}
              <View className="h-full w-full pt-14">
                {children}
              </View>
            </View>
          </View>

          {/* Power button */}
          <View 
            className="absolute right-0 top-[180px] w-1 h-20 bg-slate-700 rounded-l-sm"
            style={{ transform: 'translateX(100%)' }}
          />

          {/* Volume buttons */}
          <View 
            className="absolute left-0 top-[140px] w-1 h-12 bg-slate-700 rounded-r-sm"
            style={{ transform: 'translateX(-100%)' }}
          />
          <View 
            className="absolute left-0 top-[200px] w-1 h-16 bg-slate-700 rounded-r-sm"
            style={{ transform: 'translateX(-100%)' }}
          />
          <View 
            className="absolute left-0 top-[264px] w-1 h-16 bg-slate-700 rounded-r-sm"
            style={{ transform: 'translateX(-100%)' }}
          />
        </View>
      </View>
    </View>
  );
}
