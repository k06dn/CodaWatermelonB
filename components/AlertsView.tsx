import { View, Text, TouchableOpacity } from 'react-native';
import { motion } from "react-native-reanimated";
import { Bell, Plus, Smartphone, DoorOpen, Siren, UserCheck, Volume2, Trash2, ChevronDown } from "lucide-react-native";
import { Switch } from "./ui/switch";
import { useState } from "react";
import { toast } from "react-native-toast-message";

interface Alert {
  id: string;
  name: string;
  icon: any;
  description: string;
  enabled: boolean;
  gradient: string;
  vibration: "light" | "medium" | "strong";
  flash: boolean;
}

export function AlertsView() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      name: "Fire Alarm",
      icon: Siren,
      description: "Emergency building evacuation",
      enabled: true,
      gradient: "from-[#FF85A2] to-[#FFB3C6]",
      vibration: "strong",
      flash: true,
    },
    {
      id: "2",
      name: "Door Knock",
      icon: DoorOpen,
      description: "Someone at your door",
      enabled: true,
      gradient: "from-[#6B5CAC] to-[#8B7BC8]",
      vibration: "medium",
      flash: false,
    },
    {
      id: "3",
      name: "Phone Call",
      icon: Smartphone,
      description: "Incoming phone call",
      enabled: true,
      gradient: "from-[#F59E0B] to-[#FBBF24]",
      vibration: "medium",
      flash: true,
    },
    {
      id: "4",
      name: "Name Called",
      icon: UserCheck,
      description: "AI detected your name",
      enabled: false,
      gradient: "from-[#10B981] to-[#34D399]",
      vibration: "light",
      flash: false,
    },
  ]);

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => {
      if (alert.id === id) {
        const newEnabled = !alert.enabled;
        toast.success(newEnabled ? `${alert.name} alert enabled` : `${alert.name} alert disabled`);
        return { ...alert, enabled: newEnabled };
      }
      return alert;
    }));
  };

  const updateVibration = (id: string, level: "light" | "medium" | "strong") => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, vibration: level } : alert
    ));
    toast.success(`Vibration set to ${level}`);
  };

  const toggleFlash = (id: string) => {
    setAlerts(alerts.map(alert => {
      if (alert.id === id) {
        const newFlash = !alert.flash;
        toast.success(newFlash ? "Screen flash enabled" : "Screen flash disabled");
        return { ...alert, flash: newFlash };
      }
      return alert;
    }));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  return (
    <View className="h-full overflow-y-auto bg-[#FFFBF5]">
      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <Text className="text-[#2A0098]">Alerts</Text>
        <Text className="text-[#6B5CAC]">Customise your visual and haptic notifications</Text>
      </View>

      {/* Quick stats - glassmorphic */}
      <View className="px-6 mb-6">
        <View className="bg-white/50 backdrop-blur-xl rounded-3xl p-5 border border-white/60 shadow-lg">
          <View className="flex items-center justify-between">
            <View className="flex items-center gap-3" aria-live="polite" aria-atomic="true">
              <View className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#34D399] flex items-center justify-center shadow-md" aria-hidden="true">
                <Bell className="w-6 h-6 text-white" strokeWidth={2} />
              </View>
              <div>
                <Text className="text-[#2A0098]">
                  {alerts.filter(a => a.enabled).length} active alerts
                </Text>
                <Text className="text-[#6B5CAC] text-sm">Out of {alerts.length} total</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Alerts list */}
      <View className="px-6 pb-8">
        <View className="flex items-center justify-between mb-3">
          <Text className="text-[#2A0098]">Your Alerts</Text>
          <TouchableOpacity 
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6B5CAC] to-[#8B7BC8] flex items-center justify-center shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] transition-all"
            aria-label="Add new alert"
          >
            <Plus className="w-5 h-5 text-white" strokeWidth={2.5} aria-hidden="true" />
          </TouchableOpacity>
        </View>
        
        <View className="space-y-3" role="list">
          {alerts.map((alert, index) => {
            const Icon = alert.icon;
            const isExpanded = selectedAlert === alert.id;
            
            return (
              <div
                key={alert.id}
                role="listitem"
                className="bg-white/50 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg overflow-hidden"
              >
                {/* Alert header */}
                <View className="p-4">
                  <View className="flex items-center gap-3">
                    {/* Icon and info - clickable to expand */}
                    <button
                      className="flex items-center gap-3 flex-1 min-w-0 text-left hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-white/50 rounded-2xl p-2 -m-2 transition-opacity"
                      onPress={() => setSelectedAlert(isExpanded ? null : alert.id)}
                      aria-label={`${alert.name}: ${alert.description}. ${alert.enabled ? 'Enabled' : 'Disabled'}. Click to ${isExpanded ? 'collapse' : 'expand'} settings`}
                      aria-expanded={isExpanded}
                    >
                      <View className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${alert.gradient} flex items-center justify-center flex-shrink-0 shadow-md`} aria-hidden="true">
                        <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                      </View>
                      
                      <View className="flex-1 min-w-0">
                        <Text className="text-[#2A0098] mb-0.5 not-italic">{alert.name}</Text>
                        <Text className="text-[#6B5CAC] text-sm">{alert.description}</Text>
                      </View>

                      <ChevronDown 
                        className={`w-5 h-5 text-[#6B5CAC] transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      />
                    </TouchableOpacity>
                    
                    {/* Toggle switch */}
                    <View className="flex-shrink-0" onPress={(e) => e.stopPropagation()}>
                      <Switch
                        checked={alert.enabled}
                        onCheckedChange={() => toggleAlert(alert.id)}
                        aria-label={`${alert.enabled ? 'Disable' : 'Enable'} ${alert.name} alert`}
                      />
                    </View>
                  </View>
                </View>

                {/* Expanded details */}
                {isExpanded && (
                  <Animated.View
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <View className="px-4 pb-4 pt-2 border-t border-[#2A0098]/10 space-y-4">
                      {/* Vibration strength */}
                      <div>
                        <label className="text-[#2A0098] font-medium text-sm mb-3 block" id={`vibration-label-${alert.id}`}>
                          Vibration strength
                        </label>
                        <View 
                          className="space-y-2" 
                          role="radiogroup" 
                          aria-labelledby={`vibration-label-${alert.id}`}
                        >
                          {(["light", "medium", "strong"] as const).map((level) => {
                            const isSelected = alert.vibration === level;
                            return (
                              <button
                                key={level}
                                type="button"
                                onPress={() => updateVibration(alert.id, level)}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                                  isSelected
                                    ? `bg-gradient-to-r ${alert.gradient} text-white shadow-md`
                                    : "bg-white/70 text-[#2A0098] backdrop-blur-sm border-2 border-white/60 hover:border-[#6B5CAC]/30 hover:bg-white/90"
                                } focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-white/50`}
                                role="radio"
                                aria-checked={isSelected}
                                aria-label={`Set vibration to ${level}`}
                              >
                                <View className="flex items-center gap-3">
                                  {/* Radio indicator */}
                                  <View className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                    isSelected 
                                      ? 'border-white bg-white' 
                                      : 'border-[#6B5CAC]'
                                  }`}>
                                    {isSelected && (
                                      <View className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${alert.gradient}`}></View>
                                    )}
                                  </View>
                                  
                                  {/* Label */}
                                  <Text className="font-medium">
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                  </Text>
                                </View>
                                
                                {/* Visual indicator bars */}
                                <View className="flex items-center gap-1" aria-hidden="true">
                                  <View className={`w-1 rounded-full transition-all ${
                                    isSelected ? 'bg-white h-3' : 'bg-[#6B5CAC]/40 h-2'
                                  }`}></View>
                                  <View className={`w-1 rounded-full transition-all ${
                                    level !== 'light' 
                                      ? (isSelected ? 'bg-white h-4' : 'bg-[#6B5CAC]/40 h-3')
                                      : (isSelected ? 'bg-white/40 h-2' : 'bg-[#6B5CAC]/20 h-2')
                                  }`}></View>
                                  <View className={`w-1 rounded-full transition-all ${
                                    level === 'strong'
                                      ? (isSelected ? 'bg-white h-5' : 'bg-[#6B5CAC]/40 h-4')
                                      : (isSelected ? 'bg-white/40 h-2' : 'bg-[#6B5CAC]/20 h-2')
                                  }`}></View>
                                </View>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>

                      {/* Flash toggle */}
                      <View className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-2xl p-3 border border-white/60">
                        <div>
                          <Text className="text-[#2A0098] text-sm font-medium">Screen flash</Text>
                          <Text className="text-[#6B5CAC] text-xs">Flash screen when alert triggers</Text>
                        </View>
                        <Switch
                          checked={alert.flash}
                          onCheckedChange={() => toggleFlash(alert.id)}
                          aria-label={`${alert.flash ? 'Disable' : 'Enable'} screen flash for ${alert.name}`}
                        />
                      </View>

                      {/* Delete button */}
                      <TouchableOpacity 
                        onPress={() => deleteAlert(alert.id)}
                        className="w-full py-3 rounded-2xl bg-[#FF85A2]/20 text-[#FF85A2] text-sm flex items-center justify-center gap-2 border border-[#FF85A2]/30 hover:bg-[#FF85A2]/30 focus:outline-none focus:ring-2 focus:ring-[#FF85A2] focus:ring-offset-2 focus:ring-offset-white/50 transition-all"
                        aria-label={`Delete ${alert.name} alert`}
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                        Delete Alert
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
