import { View, Text } from 'react-native';
import { motion } from "react-native-reanimated";
import { Users, Clock, MessageCircle, Heart, Calendar, MapPin, Filter } from "lucide-react-native";
import { useState } from "react";
import { toast } from "react-native-toast-message";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Event {
  id: string;
  title: string;
  type: string;
  location: string;
  time: string;
  attendees: number;
  hasInterpreter: boolean;
  hasCaption: boolean;
  gradient: string;
}

interface StudyGroup {
  id: string;
  name: string;
  course: string;
  members: number;
  nextMeeting: string;
  gradient: string;
}

export function CommunityTab() {
  const [likedEvents, setLikedEvents] = useState<string[]>([]);
  const [eventFilter, setEventFilter] = useState<'all' | 'bsl' | 'captions'>('all');

  const toggleLike = (eventId: string) => {
    setLikedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
    
    const event = events.find(e => e.id === eventId);
    if (event && !likedEvents.includes(eventId)) {
      toast.success(`Saved ${event.title}`, {
        description: "You'll be notified before the event"
      });
    }
  };

  const events: Event[] = [
    {
      id: "1",
      title: "BSL Coffee Chat",
      type: "Social",
      location: "Student Union, Room 204",
      time: "Today, 3:00 PM",
      attendees: 12,
      hasInterpreter: true,
      hasCaption: false,
      gradient: "from-[#6B5CAC] to-[#8B7BC8]",
    },
    {
      id: "2",
      title: "Accessible Tech Workshop",
      type: "Workshop",
      location: "Engineering Building",
      time: "Tomorrow, 2:00 PM",
      attendees: 8,
      hasInterpreter: true,
      hasCaption: true,
      gradient: "from-[#FF85A2] to-[#FFB3C6]",
    },
    {
      id: "3",
      title: "Study Skills Session",
      type: "Academic",
      location: "Learning Centre",
      time: "Friday, 1:00 PM",
      attendees: 15,
      hasInterpreter: false,
      hasCaption: true,
      gradient: "from-[#10B981] to-[#34D399]",
    },
  ];

  const studyGroups: StudyGroup[] = [
    {
      id: "1",
      name: "Data Structures Study Group",
      course: "CS 301",
      members: 5,
      nextMeeting: "Wed, 4:00 PM",
      gradient: "from-[#F59E0B] to-[#FBBF24]",
    },
    {
      id: "2",
      name: "Organic Chemistry Review",
      course: "CHEM 210",
      members: 4,
      nextMeeting: "Thu, 6:00 PM",
      gradient: "from-[#10B981] to-[#34D399]",
    },
  ];

  const filteredEvents = events.filter(event => {
    if (eventFilter === 'bsl') return event.hasInterpreter;
    if (eventFilter === 'captions') return event.hasCaption;
    return true;
  });

  return (
    <View className="h-full overflow-y-auto bg-[#FFFBF5] px-6 py-4">
      {/* Campus Deaf and HOH Network - Image Header */}
      <View className="mb-6">
        <View className="relative h-40 rounded-3xl overflow-hidden shadow-lg">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758272133542-b3107b947fc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwZnJpZW5kcyUyMGNvbW11bml0eXxlbnwxfHx8fDE3NjAxMDc5NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Community members socializing together"
            className="w-full h-full object-cover"
          />
          <View className="absolute inset-0 bg-gradient-to-t from-[#2A0098]/80 via-[#2A0098]/20 to-transparent"></View>
          <View className="absolute bottom-4 left-4 right-4">
            <Text className="text-white mb-1">Campus Deaf & HOH Network</Text>
            <Text className="text-white/90 text-sm">124 students • Join the community</Text>
          </View>
        </View>
      </View>

      {/* BSL Events & Meetups */}
      <View className="mb-6">
        <View className="flex items-center justify-between mb-4">
          <Text className="text-[#2A0098]" style={{ fontWeight: 700 }}>
            Upcoming Events
          </Text>
          
          {/* Filter Pills */}
          <View className="flex gap-2">
            <button
              onPress={() => setEventFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                eventFilter === 'all'
                  ? 'bg-[#6B5CAC] text-white'
                  : 'bg-white/60 text-[#6B5CAC] border border-[#6B5CAC]/20'
              }`}
              style={{ fontWeight: 600 }}
            >
              All
            </TouchableOpacity>
            <button
              onPress={() => setEventFilter('bsl')}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                eventFilter === 'bsl'
                  ? 'bg-[#6B5CAC] text-white'
                  : 'bg-white/60 text-[#6B5CAC] border border-[#6B5CAC]/20'
              }`}
              style={{ fontWeight: 600 }}
            >
              BSL
            </TouchableOpacity>
            <button
              onPress={() => setEventFilter('captions')}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                eventFilter === 'captions'
                  ? 'bg-[#6B5CAC] text-white'
                  : 'bg-white/60 text-[#6B5CAC] border border-[#6B5CAC]/20'
              }`}
              style={{ fontWeight: 600 }}
            >
              Captions
            </TouchableOpacity>
          </View>
        </View>

        <View className="space-y-3">
          {filteredEvents.map((event, index) => (
            <Animated.View
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/80 shadow-sm"
            >
              <View className="flex gap-3">
                <View className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${event.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <Calendar className="w-6 h-6 text-white" strokeWidth={2} />
                </View>
                
                <View className="flex-1 min-w-0">
                  <View className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <Text className="text-[#2A0098] mb-1" style={{ fontWeight: 600 }}>
                        {event.title}
                      </Text>
                      <Text className="px-2 py-0.5 bg-[#6B5CAC]/10 rounded-full text-[#6B5CAC] text-xs" style={{ fontWeight: 600 }}>
                        {event.type}
                      </Text>
                    </View>
                    <button
                      onPress={() => toggleLike(event.id)}
                      className="w-8 h-8 rounded-full bg-white/60 backdrop-blur-xl flex items-center justify-center hover:bg-white/80 transition-colors"
                      aria-label={likedEvents.includes(event.id) ? "Unsave event" : "Save event"}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          likedEvents.includes(event.id)
                            ? 'fill-[#FF85A2] text-[#FF85A2]'
                            : 'text-[#6B5CAC]'
                        }`}
                        strokeWidth={2}
                      />
                    </TouchableOpacity>
                  </View>

                  <View className="space-y-1 text-xs text-[#6B5CAC]">
                    <View className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{event.time}</Text>
                    </View>
                    <View className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      <span>{event.location}</Text>
                    </View>
                    <View className="flex items-center gap-1.5">
                      <Users className="w-3 h-3" />
                      <span>{event.attendees} attending</Text>
                    </View>
                  </View>

                  {/* Accessibility Features */}
                  <View className="flex gap-2 mt-3">
                    {event.hasInterpreter && (
                      <Text className="px-2 py-1 bg-[#10B981]/10 border border-[#10B981]/20 rounded-lg text-[#10B981] text-xs" style={{ fontWeight: 600 }}>
                        BSL Interpreter
                      </Text>
                    )}
                    {event.hasCaption && (
                      <Text className="px-2 py-1 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-lg text-[#3B82F6] text-xs" style={{ fontWeight: 600 }}>
                        Captions
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>

        {filteredEvents.length === 0 && (
          <View className="text-center py-8">
            <Text className="text-[#6B5CAC]">No events match this filter</Text>
          </View>
        )}
      </View>

      {/* Study Groups */}
      <View className="mb-6">
        <Text className="text-[#2A0098] mb-4" style={{ fontWeight: 700 }}>
          Study Groups
        </Text>
        <View className="space-y-3">
          {studyGroups.map((group, index) => (
            <Animated.View
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (filteredEvents.length + index) * 0.1 }}
              className="w-full bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/80 shadow-sm hover:shadow-md hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] transition-all text-left"
              onPress={() => toast.success(`Opening ${group.name}`, {
                description: "Study group details would open here"
              })}
              aria-label={`View ${group.name} study group for ${group.course}. ${group.members} members. Next meeting ${group.nextMeeting}`}
            >
              <View className="flex gap-3">
                <View className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${group.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <MessageCircle className="w-6 h-6 text-white" strokeWidth={2} />
                </View>
                
                <View className="flex-1 min-w-0">
                  <Text className="text-[#2A0098] mb-1.5" style={{ fontWeight: 600 }}>
                    {group.name}
                  </Text>
                  <View className="space-y-0.5 text-xs text-[#6B5CAC]">
                    <View className="flex items-center gap-1.5">
                      <Text className="px-2 py-0.5 bg-[#6B5CAC]/10 border border-[#6B5CAC]/20 rounded-full" style={{ fontWeight: 600 }}>
                        {group.course}
                      </Text>
                      <span>{group.members} members</Text>
                    </View>
                    <View className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Next: {group.nextMeeting}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* CTA to Create/Join */}
      <View className="pb-6">
        <View className="bg-[#FF85A2]/10 backdrop-blur-xl rounded-2xl p-5 border border-[#FF85A2]/20">
          <Text className="text-[#2A0098] mb-2" style={{ fontWeight: 700 }}>
            Start Your Own 🚀
          </Text>
          <Text className="text-[#6B5CAC] text-sm mb-4">
            Create a new study group or event for the Deaf and HOH community
          </Text>
          <button
            onPress={() => toast.success("Create Event/Group", {
              description: "Creation form would open here"
            })}
            className="w-full bg-gradient-to-r from-[#FF85A2] to-[#6B5CAC] text-white rounded-xl p-3 hover:shadow-lg transition-all"
            style={{ fontWeight: 700 }}
          >
            + Create Event or Study Group
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}