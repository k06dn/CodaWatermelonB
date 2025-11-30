import { View, Text, TouchableOpacity } from 'react-native';
import { motion, AnimatePresence } from "react-native-reanimated";
import { MapPin, Clock, Users, MessageCircle, Heart, ChevronRight, Map, BookOpen, Filter, Plus } from "lucide-react-native";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { SensoryScoutRoom } from "./SensoryScoutRoom";

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

interface SensoryProfile {
  id: string;
  name: string;
  location: string;
  lipReadingVisibility: number;
  acoustics: number;
  visualNoise: number;
  topTip: string;
  reviewCount: number;
  gradient: string;
}

interface Resource {
  id: string;
  title: string;
  category: string;
  icon: any;
  gradient: string;
}

export function CommunityView() {
  const [showSensoryScout, setShowSensoryScout] = useState(false);
  const [likedEvents, setLikedEvents] = useState<string[]>([]);
  const [eventFilter, setEventFilter] = useState<'all' | 'bsl' | 'captions'>('all');

  const toggleLike = (eventId: string) => {
    setLikedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
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

  const sensoryProfiles: SensoryProfile[] = [
    {
      id: "1",
      name: "Darwin Lecture Theatre B40",
      location: "Darwin Building, Ground Floor",
      lipReadingVisibility: 4.5,
      acoustics: 3.0,
      visualNoise: 4.0,
      topTip: "Front-left seats are best - under sound-dampening panel with excellent lighting",
      reviewCount: 23,
      gradient: "from-[#6B5CAC] to-[#8B7BC8]",
    },
    {
      id: "2",
      name: "Library Study Room 3A",
      location: "Main Library, 3rd Floor",
      lipReadingVisibility: 5.0,
      acoustics: 4.5,
      visualNoise: 5.0,
      topTip: "Circular table layout makes it easy to see everyone. Perfect natural lighting",
      reviewCount: 18,
      gradient: "from-[#10B981] to-[#34D399]",
    },
  ];

  const resources: Resource[] = [
    {
      id: "1",
      title: "BSL Interpretation Guide",
      category: "Guide",
      icon: BookOpen,
      gradient: "from-[#6B5CAC] to-[#8B7BC8]",
    },
    {
      id: "2",
      title: "Campus Accessibility Map",
      category: "Resource",
      icon: Map,
      gradient: "from-[#10B981] to-[#34D399]",
    },
  ];

  const filteredEvents = events.filter(event => {
    if (eventFilter === 'bsl') return event.hasInterpreter;
    if (eventFilter === 'captions') return event.hasCaption;
    return true;
  });

  return (
    <View className="h-full overflow-y-auto bg-[#FFFBF5]">
      {/* Header */}
      <View className="px-6 pt-6 pb-4">
        <Text className="text-[#2A0098]">Connect</Text>
        <Text className="text-[#6B5CAC]">
          Community, events, and accessible spaces
        </Text>
      </View>

      {/* Sensory Scout CTA - glassmorphic */}
      <View className="px-6 mb-6">
        <Animated.View
          onPress={() => setShowSensoryScout(!showSensoryScout)}
          className="w-full bg-gradient-to-br from-[#10B981]/20 to-[#34D399]/20 backdrop-blur-xl rounded-3xl p-5 border border-[#10B981]/30 shadow-lg hover:bg-[#10B981]/30 focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] transition-all"
          whileTap={{ scale: 0.98 }}
          aria-label={`Sensory Scout: Find the best spots on campus${showSensoryScout ? ', expanded' : ', collapsed'}`}
          aria-expanded={showSensoryScout}
        >
          <View className="flex items-center gap-4">
            <View className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#34D399] flex items-center justify-center shadow-md" aria-hidden="true">
              <Map className="w-7 h-7 text-white" strokeWidth={2} />
            </View>
            <View className="flex-1 text-left">
              <Text className="text-[#2A0098] mb-1">Sensory Scout</Text>
              <Text className="text-[#6B5CAC] text-sm">
                Find accessible study spaces with community ratings
              </Text>
            </View>
            <ChevronRight className={`w-5 h-5 text-[#2A0098] transition-transform ${showSensoryScout ? 'rotate-90' : ''}`} aria-hidden="true" />
          </View>
        </Animated.View>
      </View>

      {/* Sensory Scout Content */}
      {/* AnimatePresence - replace with conditional render */
        {showSensoryScout && (
          <Animated.View
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <View className="h-[600px]">
              <SensoryScoutRoom />
            </View>
          </Animated.View>
        )}
      

      {/* Resources Section */}
      <View className="px-6 mb-6">
        <Text className="text-[#2A0098] mb-3">Quick Resources</Text>
        <View className="grid grid-cols-2 gap-3">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <Animated.View
                key={resource.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/50 backdrop-blur-xl rounded-2xl p-4 border border-white/60 shadow-lg hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] transition-all text-left"
                aria-label={`Open ${resource.title}`}
              >
                <View className={`w-10 h-10 rounded-xl bg-gradient-to-br ${resource.gradient} flex items-center justify-center mb-3 shadow-md`} aria-hidden="true">
                  <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                </View>
                <Text className="text-[#2A0098] text-sm mb-1">{resource.title}</Text>
                <Text className="text-[#6B5CAC] text-xs">{resource.category}</Text>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {/* Featured community image */}
      <View className="px-6 mb-6">
        <View className="relative h-40 rounded-3xl overflow-hidden shadow-lg">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1758272133542-b3107b947fc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwZnJpZW5kcyUyMGNvbW11bml0eXxlbnwxfHx8fDE3NjAxMDc5NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Community members socializing together"
            className="w-full h-full object-cover"
          />
          <View className="absolute inset-0 bg-gradient-to-t from-[#2A0098]/80 via-[#2A0098]/20 to-transparent"></View>
          <View className="absolute bottom-4 left-4 right-4">
            <Text className="text-white mb-1">Campus Deaf & HoH Network</Text>
            <Text className="text-white/90 text-sm">124 students • Join the community</Text>
          </View>
        </View>
      </View>

      {/* Upcoming Events */}
      <View className="px-6 mb-6">
        <View className="flex items-center justify-between mb-3">
          <Text className="text-[#2A0098]">Upcoming Events</Text>
          <TouchableOpacity 
            className="text-[#6B5CAC] text-sm flex items-center gap-1 hover:text-[#2A0098] focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] rounded-lg px-2 py-1 -mr-2 transition-colors"
            aria-label="See all upcoming events"
          >
            See all
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </TouchableOpacity>
        </View>

        {/* Event Filters */}
        <View className="flex gap-2 mb-4">
          <button
            onPress={() => setEventFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs transition-all ${
              eventFilter === 'all'
                ? 'bg-[#2A0098] text-white shadow-md'
                : 'bg-white/50 text-[#6B5CAC] border border-white/60 hover:bg-white/70'
            } focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5]`}
            aria-label="Show all events"
            aria-pressed={eventFilter === 'all'}
          >
            All Events
          </TouchableOpacity>
          <button
            onPress={() => setEventFilter('bsl')}
            className={`px-3 py-1.5 rounded-full text-xs transition-all ${
              eventFilter === 'bsl'
                ? 'bg-[#6B5CAC] text-white shadow-md'
                : 'bg-white/50 text-[#6B5CAC] border border-white/60 hover:bg-white/70'
            } focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5]`}
            aria-label="Filter to BSL interpreted events only"
            aria-pressed={eventFilter === 'bsl'}
          >
            BSL Only
          </TouchableOpacity>
          <button
            onPress={() => setEventFilter('captions')}
            className={`px-3 py-1.5 rounded-full text-xs transition-all ${
              eventFilter === 'captions'
                ? 'bg-[#FF85A2] text-white shadow-md'
                : 'bg-white/50 text-[#6B5CAC] border border-white/60 hover:bg-white/70'
            } focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5]`}
            aria-label="Filter to captioned events only"
            aria-pressed={eventFilter === 'captions'}
          >
            Captions
          </TouchableOpacity>
        </View>
        
        <View className="space-y-3">
          <AnimatePresence mode="wait">
            {filteredEvents.map((event, index) => {
              const isLiked = likedEvents.includes(event.id);
              
              return (
                <Animated.View
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/50 backdrop-blur-xl rounded-3xl p-4 border border-white/60 shadow-lg"
                >
                  <View className="flex gap-3">
                    <View className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${event.gradient} flex items-center justify-center flex-shrink-0 shadow-md`} aria-hidden="true">
                      <Users className="w-6 h-6 text-white" strokeWidth={2} />
                    </View>
                    
                    <View className="flex-1 min-w-0">
                      <View className="flex items-start justify-between gap-2 mb-2">
                        <Text className="text-[#2A0098]">{event.title}</Text>
                        <button
                          onPress={() => toggleLike(event.id)}
                          className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-white/50 rounded-full p-1.5 transition-transform hover:scale-110 active:scale-90"
                          aria-label={isLiked ? `Unlike ${event.title}` : `Like ${event.title}`}
                          aria-pressed={isLiked}
                        >
                          <Heart 
                            className={`w-5 h-5 transition-all ${isLiked ? 'fill-[#FF85A2] text-[#FF85A2]' : 'fill-transparent text-[#6B5CAC]'}`} 
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        </TouchableOpacity>
                      </View>
                      
                      <View className="text-xs text-[#6B5CAC] mb-2.5">
                        <View className="flex items-center gap-1 mb-0.5">
                          <Clock className="w-3 h-3" aria-hidden="true" />
                          {event.time}
                        </View>
                        <View className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" aria-hidden="true" />
                          {event.location}
                        </View>
                      </View>
                      
                      <View className="flex items-center gap-1.5 flex-wrap">
                        {event.hasInterpreter && (
                          <Text className="px-2 py-0.5 bg-[#6B5CAC]/20 text-[#6B5CAC] text-xs rounded-full">
                            BSL Interpreter
                          </Text>
                        )}
                        {event.hasCaption && (
                          <Text className="px-2 py-0.5 bg-[#FF85A2]/20 text-[#FF85A2] text-xs rounded-full">
                            Live Captions
                          </Text>
                        )}
                        <Text className="px-2 py-0.5 bg-[#10B981]/20 text-[#10B981] text-xs rounded-full">
                          {event.attendees} attending
                        </Text>
                      </View>
                    </View>
                  </View>
                </Animated.View>
              );
            })}
          
        </View>
      </View>

      {/* Study Groups */}
      <View className="px-6 pb-8">
        <View className="flex items-center justify-between mb-3">
          <Text className="text-[#2A0098]">Your Study Groups</Text>
          <TouchableOpacity 
            className="text-[#6B5CAC] hover:text-[#2A0098] focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] rounded-lg px-2 py-1 transition-colors"
            aria-label="Create new study group"
          >
            <Plus className="w-4 h-4 inline-block mr-1" aria-hidden="true" />
            New
          </TouchableOpacity>
        </View>
        
        <View className="space-y-3">
          {studyGroups.map((group, index) => (
            <Animated.View
              key={group.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (filteredEvents.length + index) * 0.1 }}
              className="w-full bg-white/50 backdrop-blur-xl rounded-3xl p-4 border border-white/60 shadow-lg hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#6B5CAC] focus:ring-offset-2 focus:ring-offset-[#FFFBF5] transition-all text-left"
              aria-label={`View ${group.name} study group for ${group.course}. ${group.members} members. Next meeting ${group.nextMeeting}`}
            >
              <View className="flex gap-3">
                <View className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${group.gradient} flex items-center justify-center flex-shrink-0 shadow-md`} aria-hidden="true">
                  <MessageCircle className="w-6 h-6 text-white" strokeWidth={2} />
                </View>
                
                <View className="flex-1 min-w-0">
                  <Text className="text-[#2A0098] mb-1.5">{group.name}</Text>
                  <View className="space-y-0.5 text-xs text-[#6B5CAC]">
                    <View className="flex items-center gap-1.5">
                      <Text className="px-2 py-0.5 bg-[#6B5CAC]/20 rounded-full">{group.course}</Text>
                      <span>{group.members} members</Text>
                    </View>
                    <View className="flex items-center gap-1">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      <span>Next: {group.nextMeeting}</Text>
                    </View>
                  </View>
                </View>
                
                <ChevronRight className="w-5 h-5 text-[#6B5CAC] flex-shrink-0 self-center" aria-hidden="true" />
              </View>
            </Animated.View>
          ))}
        </View>
      </View>
    </View>
  );
}